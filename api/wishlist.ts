import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { characterKeys } from "@/api/character";
import { API_BASE_URL, apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { goalsKeys } from "@/api/goals";
import { logKeys } from "@/api/log";
import type { ApiSuccess } from "@/api/types";

export type WishItemStatus = "WISHLISTED" | "DROPPED" | "BOUGHT";
export type WishItemType = "AUTO" | "MANUAL";
export type PurchaseTimeSlot = "MORNING" | "EVENING" | "NIGHT";

export type CursorParams = { take?: number; cursor?: string };

export type WishItemSummary = {
  id: string;
  name: string;
  price: number;
  photoUrl: string | null;
  type: WishItemType;
  status: WishItemStatus;
};

export type WishItemListParams = CursorParams & {
  status: WishItemStatus;
};

export type WishItemListResponse = {
  nextCursor: string | null;
  wishitems: WishItemSummary[];
};

export type WishItemDetail = {
  id: string;
  folder: string | null;
  name: string;
  price: number;
  platform: string | null;
  brand: string | null;
  photoUrl: string | null;
  productUrl: string | null;
  reason: string | null;
  refreshedAt: string | null;
  addedAt: string;
  updatedAt: string;
  status: WishItemStatus;
};

export type UploadFile = { uri: string; name: string; type: string };

export type CreateWishItemRequest = {
  productName: string;
  price: number;
  storeName?: string;
  brandName?: string;
  reason?: string;
  url?: string;
  file?: UploadFile;
};
export type CreateWishItemResponse = { id: string; createdAt: string };

export type UpdateWishItemRequest = Partial<CreateWishItemRequest>;

export type UpdateReasonRequest = { reason: string; type: WishItemType };
export type MoveFolderRequest = { type: WishItemType; folderId: string };

export type BuyWishItemRequest = {
  type: WishItemType;
  date: string;
  purchasedAt: PurchaseTimeSlot;
  reasonId?: number;
  reason?: string;
};

export type WishAnalyticsSummary = { totalCount: number; totalPrice: number };
export type WishAnalytics = {
  droppedItems: WishAnalyticsSummary;
  boughtItems: WishAnalyticsSummary;
};

export type WishFolder = { id: string; name: string };
export type CreateFolderResponse = { folderId: string; createdAt: string };
export type WishFolderListResponse = { folders: WishFolder[]; nextCursor: string | null };

export type CrawlTaskResponse = { jobId: string; requestedAt: string };

export type CrawlConnectedEvent = { jobId: string };
export type CrawlDoneEvent = {
  result: { result: "DONE" | "FAILED"; dataId: string | null };
};

export type CrawlResult = {
  id: string;
  productName: string;
  platformName: string;
  productId: string;
  price: number;
  updatedAt: string;
  imageUrl: string | null;
};

const toFormData = (body: Partial<CreateWishItemRequest>) => {
  const form = new FormData();
  (Object.keys(body) as (keyof CreateWishItemRequest)[]).forEach((key) => {
    const value = body[key];
    if (value === undefined) return;
    if (key === "file") {
      form.append("file", value as unknown as Blob);
    } else {
      form.append(key, String(value));
    }
  });
  return form;
};

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export const wishlistApi = {
  getItems: async (params: WishItemListParams) =>
    (
      await apiClient.get<ApiSuccess<WishItemListResponse>>(ENDPOINTS.wishlist.items, {
        params,
      })
    ).data.data,

  createItem: async (body: CreateWishItemRequest) =>
    (
      await apiClient.post<ApiSuccess<CreateWishItemResponse>>(
        ENDPOINTS.wishlist.items,
        toFormData(body),
        MULTIPART,
      )
    ).data.data,

  getItem: async (itemId: string, type: WishItemType) =>
    (
      await apiClient.get<ApiSuccess<WishItemDetail>>(ENDPOINTS.wishlist.item(itemId), {
        params: { type },
      })
    ).data.data,

  updateItem: async (itemId: string, body: UpdateWishItemRequest) => {
    await apiClient.patch(ENDPOINTS.wishlist.item(itemId), toFormData(body), MULTIPART);
  },

  deleteItem: async (itemId: string, type: WishItemType) => {
    await apiClient.delete(ENDPOINTS.wishlist.item(itemId), { params: { type } });
  },

  updateReason: async (itemId: string, body: UpdateReasonRequest) => {
    await apiClient.patch(ENDPOINTS.wishlist.itemReason(itemId), body);
  },

  moveFolder: async (itemId: string, body: MoveFolderRequest) => {
    await apiClient.patch(ENDPOINTS.wishlist.itemFolder(itemId), body);
  },

  buyItem: async (itemId: string, body: BuyWishItemRequest) => {
    await apiClient.post(ENDPOINTS.wishlist.itemBuy(itemId), body);
  },

  dropItem: async (itemId: string, type: WishItemType) => {
    await apiClient.post(ENDPOINTS.wishlist.itemDrop(itemId), { type });
  },

  getAnalytics: async () =>
    (await apiClient.get<ApiSuccess<WishAnalytics>>(ENDPOINTS.wishlist.analytics)).data.data,

  createFolder: async (name: string) =>
    (
      await apiClient.post<ApiSuccess<CreateFolderResponse>>(ENDPOINTS.wishlist.folders, {
        name,
      })
    ).data.data,

  getFolders: async (params: CursorParams = {}) =>
    (
      await apiClient.get<ApiSuccess<WishFolderListResponse>>(ENDPOINTS.wishlist.folders, {
        params,
      })
    ).data.data,

  deleteFolder: async (folderId: string) => {
    await apiClient.delete(ENDPOINTS.wishlist.folder(folderId));
  },

  getFolderItems: async (folderId: string, params: CursorParams = {}) =>
    (
      await apiClient.get<ApiSuccess<WishItemListResponse>>(
        ENDPOINTS.wishlist.folderItems(folderId),
        { params },
      )
    ).data.data,
};

export type CrawlEventHandlers = {
  onConnected?: (event: CrawlConnectedEvent) => void;
  onDone: (event: CrawlDoneEvent) => void;
  onError?: (error: Error) => void;
};

export const subscribeCrawlEvents = (jobId: string, handlers: CrawlEventHandlers) => {
  const xhr = new XMLHttpRequest();
  let readIndex = 0;
  let buffer = "";
  let finished = false;

  const finish = () => {
    finished = true;
    xhr.abort();
  };

  const dispatch = (block: string) => {
    let event = "message";
    const dataLines: string[] = [];
    block.split(/\r?\n/).forEach((line) => {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    });
    if (dataLines.length === 0) return;

    try {
      const data: unknown = JSON.parse(dataLines.join("\n"));
      if (event === "connected") handlers.onConnected?.(data as CrawlConnectedEvent);
      if (event === "done") {
        finish();
        handlers.onDone(data as CrawlDoneEvent);
      }
    } catch {
    }
  };

  const consume = () => {
    if (finished) return;
    buffer += xhr.responseText.slice(readIndex);
    readIndex = xhr.responseText.length;
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? "";
    blocks.forEach(dispatch);
  };

  xhr.onprogress = consume;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 3) consume();
    if (xhr.readyState !== 4 || finished) return;
    consume();
    if (buffer.trim()) dispatch(buffer);
    if (!finished) {
      finished = true;
      handlers.onError?.(new Error(`SSE 연결이 종료되었습니다. (status ${xhr.status})`));
    }
  };
  xhr.onerror = () => {
    if (finished) return;
    finished = true;
    handlers.onError?.(new Error("SSE 연결에 실패했습니다."));
  };

  xhr.open("GET", `${API_BASE_URL}${ENDPOINTS.wishlist.crawlEvents(jobId)}`);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Accept", "text/event-stream");
  xhr.send();

  return () => {
    if (!finished) finish();
  };
};

export const crawlApi = {
  requestCrawl: async (url: string) =>
    (await apiClient.post<ApiSuccess<CrawlTaskResponse>>(ENDPOINTS.wishlist.crawlTasks, { url }))
      .data.data,

  getCrawlResult: async (cacheId: string) =>
    (await apiClient.get<ApiSuccess<CrawlResult>>(ENDPOINTS.wishlist.crawlResult(cacheId))).data
      .data,

  crawlProduct: async (url: string, timeoutMs = 60_000): Promise<CrawlResult> => {
    const { jobId } = await crawlApi.requestCrawl(url);
    const dataId = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        unsubscribe();
        reject(new Error("상품 정보를 가져오는 데 시간이 너무 오래 걸려요."));
      }, timeoutMs);
      const unsubscribe = subscribeCrawlEvents(jobId, {
        onDone: ({ result }) => {
          clearTimeout(timer);
          if (result.result === "DONE" && result.dataId) resolve(result.dataId);
          else reject(new Error("상품 정보를 가져오지 못했어요."));
        },
        onError: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
    });
    return crawlApi.getCrawlResult(dataId);
  },
};

export const wishlistKeys = {
  all: ["wishlist"] as const,
  itemLists: ["wishlist", "items", "list"] as const,
  itemList: (params: Omit<WishItemListParams, "cursor">) =>
    ["wishlist", "items", "list", params] as const,
  itemDetails: ["wishlist", "items", "detail"] as const,
  itemDetail: (itemId: string) => ["wishlist", "items", "detail", itemId] as const,
  analytics: ["wishlist", "analytics"] as const,
  folders: ["wishlist", "folders"] as const,
  folderItemLists: ["wishlist", "folderItems"] as const,
  folderItems: (folderId: string) => ["wishlist", "folderItems", folderId] as const,
  crawlResult: (cacheId: string) => ["wishlist", "crawlResult", cacheId] as const,
};

const invalidateItemLists = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: wishlistKeys.itemLists }),
    queryClient.invalidateQueries({ queryKey: wishlistKeys.folderItemLists }),
  ]);

const invalidateSpendingViews = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: goalsKeys.spend }),
    queryClient.invalidateQueries({ queryKey: logKeys.all }),
    queryClient.invalidateQueries({ queryKey: characterKeys.comment }),
  ]);

export const useWishItems = (
  params: Omit<WishItemListParams, "cursor">,
  options?: { enabled?: boolean },
) =>
  useInfiniteQuery({
    queryKey: wishlistKeys.itemList(params),
    queryFn: ({ pageParam }) => wishlistApi.getItems({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    ...options,
  });

export const useWishItem = (
  itemId: string,
  type: WishItemType,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: wishlistKeys.itemDetail(itemId),
    queryFn: () => wishlistApi.getItem(itemId, type),
    ...options,
  });

export const useWishAnalytics = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: wishlistKeys.analytics, queryFn: wishlistApi.getAnalytics, ...options });

export const useWishFolders = (take?: number, options?: { enabled?: boolean }) =>
  useInfiniteQuery({
    queryKey: [...wishlistKeys.folders, { take }],
    queryFn: ({ pageParam }) => wishlistApi.getFolders({ take, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    ...options,
  });

export const useWishFolderItems = (
  folderId: string,
  take?: number,
  options?: { enabled?: boolean },
) =>
  useInfiniteQuery({
    queryKey: [...wishlistKeys.folderItems(folderId), { take }],
    queryFn: ({ pageParam }) => wishlistApi.getFolderItems(folderId, { take, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    ...options,
  });

export const useCrawlResult = (cacheId: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: wishlistKeys.crawlResult(cacheId),
    queryFn: () => crawlApi.getCrawlResult(cacheId),
    ...options,
  });

export const useCreateWishItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.createItem,
    onSuccess: () => invalidateItemLists(queryClient),
  });
};

export const useUpdateWishItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, body }: { itemId: string; body: UpdateWishItemRequest }) =>
      wishlistApi.updateItem(itemId, body),
    onSuccess: (_, { itemId }) =>
      Promise.all([
        invalidateItemLists(queryClient),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.itemDetail(itemId) }),
      ]),
  });
};

export const useDeleteWishItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, type }: { itemId: string; type: WishItemType }) =>
      wishlistApi.deleteItem(itemId, type),
    onSuccess: (_, { itemId }) => {
      queryClient.removeQueries({ queryKey: wishlistKeys.itemDetail(itemId) });
      return Promise.all([
        invalidateItemLists(queryClient),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.analytics }),
      ]);
    },
  });
};

export const useUpdateWishReason = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, ...body }: UpdateReasonRequest & { itemId: string }) =>
      wishlistApi.updateReason(itemId, body),
    onSuccess: (_, { itemId }) =>
      queryClient.invalidateQueries({ queryKey: wishlistKeys.itemDetail(itemId) }),
  });
};

export const useMoveWishFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, ...body }: MoveFolderRequest & { itemId: string }) =>
      wishlistApi.moveFolder(itemId, body),
    onSuccess: (_, { itemId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: wishlistKeys.folderItemLists }),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.itemDetail(itemId) }),
      ]),
  });
};

export const useBuyWishItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, ...body }: BuyWishItemRequest & { itemId: string }) =>
      wishlistApi.buyItem(itemId, body),
    onSuccess: (_, { itemId }) =>
      Promise.all([
        invalidateItemLists(queryClient),
        invalidateSpendingViews(queryClient),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.itemDetail(itemId) }),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.analytics }),
      ]),
  });
};

export const useDropWishItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, type }: { itemId: string; type: WishItemType }) =>
      wishlistApi.dropItem(itemId, type),
    onSuccess: (_, { itemId }) =>
      Promise.all([
        invalidateItemLists(queryClient),
        invalidateSpendingViews(queryClient),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.itemDetail(itemId) }),
        queryClient.invalidateQueries({ queryKey: wishlistKeys.analytics }),
      ]),
  });
};

export const useCreateWishFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.createFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.folders }),
  });
};

export const useDeleteWishFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.deleteFolder,
    onSuccess: (_, folderId) => {
      queryClient.removeQueries({ queryKey: wishlistKeys.folderItems(folderId) });
      return queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

export const useRequestCrawl = () => useMutation({ mutationFn: crawlApi.requestCrawl });

// 크롤링이 끝나면 서버에 위시 아이템이 등록되므로 위시 캐시도 갱신
export const useCrawlProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => crawlApi.crawlProduct(url),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
};
