import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import { characterKeys } from "@/api/character";
import { API_BASE_URL, apiClient, refreshSession } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { goalsKeys } from "@/api/goals";
import { logKeys } from "@/api/log";
import { tokenStorage } from "@/api/tokenStorage";
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
  let xhr: XMLHttpRequest | null = null;
  let finished = false;

  const finish = () => {
    finished = true;
    xhr?.abort();
  };

  const fail = (message: string) => {
    if (finished) return;
    finished = true;
    handlers.onError?.(new Error(message));
  };

  const dispatch = (block: string) => {
    let event = "message";
    const dataLines: string[] = [];
    block.split(/\r?\n/).forEach((line) => {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    });

    if (event === "error") {
      fail("상품 정보를 가져오지 못했어요.");
      xhr?.abort();
      return;
    }
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

  // 서버는 연결을 여는 순간에만 토큰을 검사하므로 401은 연결 시점에만 발생
  const connect = async (canRefresh: boolean) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (finished) return;

    const request = new XMLHttpRequest();
    xhr = request;
    let readIndex = 0;
    let buffer = "";

    const consume = () => {
      if (finished) return;
      buffer += request.responseText.slice(readIndex);
      readIndex = request.responseText.length;
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? "";
      blocks.forEach(dispatch);
    };

    request.onprogress = consume;
    request.onreadystatechange = () => {
      if (request.readyState === 3) consume();
      if (request.readyState !== 4 || finished) return;

      if (request.status === 401 && canRefresh) {
        refreshSession()
          .then(() => connect(false))
          .catch(() => fail("로그인이 만료되었습니다. 다시 로그인해주세요."));
        return;
      }

      consume();
      if (buffer.trim()) dispatch(buffer);
      fail(`SSE 연결이 종료되었습니다. (status ${request.status})`);
    };
    request.onerror = () => fail("SSE 연결에 실패했습니다.");

    request.open("GET", `${API_BASE_URL}${ENDPOINTS.wishlist.crawlEvents(jobId)}`);
    request.withCredentials = true;
    request.setRequestHeader("Accept", "text/event-stream");
    if (accessToken) request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    request.send();
  };

  connect(true).catch(() => fail("SSE 연결에 실패했습니다."));

  return () => {
    if (!finished) finish();
  };
};

const SUPPORTED_SHOP_HOST = /(^|\.)(musinsa\.com|29cm\.co\.kr)$/i;
const SHOP_URL_IN_TEXT = /https?:\/\/[\w.-]*(?:musinsa\.com|29cm\.co\.kr)\/[^\s"'<>\\?#]*/i;
const URL_PARTS = /^(https?:\/\/([^/?#:]+)(?::\d+)?)([^?#]*)/i;
const SHORT_LINK_TIMEOUT_MS = 8_000;

// 공유 링크에 붙는 추적 값(무신사 계정 아이디 포함)은 크롤링에 필요 없어 상품 경로만 남김
const toShopProductUrl = (url: string) => {
  const match = url.match(URL_PARTS);
  if (!match || !SUPPORTED_SHOP_HOST.test(match[2])) return null;
  return `${match[1]}${match[3]}`;
};

// 서버는 musinsa.onelink.me 같은 앱 공유용 짧은 링크를 따라가지 않으므로 앱에서 실제 상품 주소를 찾아 보냄
const resolveShopProductUrl = async (url: string) => {
  const direct = toShopProductUrl(url);
  if (direct) return direct;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHORT_LINK_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    const redirected = toShopProductUrl(response.url);
    if (redirected) return redirected;

    // 브라우저로 판단되면 리다이렉트 대신 상품 주소가 담긴 HTML을 내려줌
    const linkInPage = (await response.text()).match(SHOP_URL_IN_TEXT)?.[0];
    return (linkInPage && toShopProductUrl(linkInPage)) || url;
  } catch {
    return url;
  } finally {
    clearTimeout(timer);
  }
};

export const crawlApi = {
  requestCrawl: async (url: string) =>
    (await apiClient.post<ApiSuccess<CrawlTaskResponse>>(ENDPOINTS.wishlist.crawlTasks, { url }))
      .data.data,

  getCrawlResult: async (cacheId: string) =>
    (await apiClient.get<ApiSuccess<CrawlResult>>(ENDPOINTS.wishlist.crawlResult(cacheId))).data
      .data,

  // 서버 대기 시간이 최대 2분이라 그보다 먼저 포기하지 않도록 여유를 둠
  crawlProduct: async (url: string, timeoutMs = 130_000): Promise<CrawlResult> => {
    const { jobId } = await crawlApi.requestCrawl(await resolveShopProductUrl(url));
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
