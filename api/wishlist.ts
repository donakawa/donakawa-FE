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

// ---------- Types (노션 API 명세서 > 위시) ----------

export type WishItemStatus = "WISHLISTED" | "DROPPED" | "BOUGHT";
// AUTO: URL 크롤링으로 등록 / MANUAL: 직접 등록. 상세/수정/삭제 등 대부분의 API에 함께 보내야 함
export type WishItemType = "AUTO" | "MANUAL";
export type PurchaseTimeSlot = "MORNING" | "EVENING" | "NIGHT";

// 커서 기반 페이지네이션 공통 쿼리 (take: 1~10)
export type CursorParams = { take?: number; cursor?: string };

// 리스트용 아이템 (photoUrl은 10분간 유효한 S3 presigned URL)
export type WishItemSummary = {
  id: string;
  name: string;
  price: number;
  // 명세 예시는 항상 값이 있으나 이미지 없는 수동 등록 상품을 대비해 nullable 처리
  photoUrl: string | null;
  type: WishItemType;
  status: WishItemStatus;
};

export type WishItemListParams = CursorParams & {
  // 생략 시 전체 상태 조회로 가정 (명세상 필수 여부 불명확)
  status?: WishItemStatus;
};

export type WishItemListResponse = {
  // 마지막 페이지면 null로 가정
  nextCursor: string | null;
  wishitems: WishItemSummary[];
};

export type WishItemDetail = {
  id: string;
  // 폴더 이름 (폴더 미지정 시 null로 가정)
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

// React Native FormData 파일 객체 형태 (expo-image-picker 결과의 uri 등)
export type UploadFile = { uri: string; name: string; type: string };

// multipart/form-data. 필수 여부는 명세에 없어 이름/가격만 필수로 가정
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

// 명세 페이지가 비어 있음: 등록과 같은 필드를 부분 수정하는 multipart로 가정 (백엔드 확인 필요)
export type UpdateWishItemRequest = Partial<CreateWishItemRequest>;

export type UpdateReasonRequest = { reason: string; type: WishItemType };
export type MoveFolderRequest = { type: WishItemType; folderId: string };

export type BuyWishItemRequest = {
  type: WishItemType;
  // YYYY-MM-DD
  date: string;
  purchasedAt: PurchaseTimeSlot;
  // 프리셋 이유 ID 또는 직접 입력 이유 중 하나를 보내는 것으로 가정
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

// 현재 무신사, 29CM 상품 URL만 지원
export type CrawlTaskResponse = { jobId: string; requestedAt: string };

// SSE 이벤트 (text/event-stream)
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

// ---------- API ----------

const toFormData = (body: Partial<CreateWishItemRequest>) => {
  const form = new FormData();
  (Object.keys(body) as (keyof CreateWishItemRequest)[]).forEach((key) => {
    const value = body[key];
    if (value === undefined) return;
    if (key === "file") {
      // RN의 FormData는 { uri, name, type } 객체를 파일로 전송함
      form.append("file", value as unknown as Blob);
    } else {
      form.append(key, String(value));
    }
  });
  return form;
};

// apiClient 기본 헤더가 JSON이라, 그대로 두면 axios가 FormData를 JSON으로 변환함
const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export const wishlistApi = {
  getItems: async (params: WishItemListParams = {}) =>
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

  // 수동 등록(MANUAL) 상품 전용. 응답 바디는 명세에 없어 사용하지 않음
  updateItem: async (itemId: string, body: UpdateWishItemRequest) => {
    await apiClient.patch(ENDPOINTS.wishlist.item(itemId), toFormData(body), MULTIPART);
  },

  // 204
  deleteItem: async (itemId: string, type: WishItemType) => {
    await apiClient.delete(ENDPOINTS.wishlist.item(itemId), { params: { type } });
  },

  // 204
  updateReason: async (itemId: string, body: UpdateReasonRequest) => {
    await apiClient.patch(ENDPOINTS.wishlist.itemReason(itemId), body);
  },

  // 204
  moveFolder: async (itemId: string, body: MoveFolderRequest) => {
    await apiClient.patch(ENDPOINTS.wishlist.itemFolder(itemId), body);
  },

  // 204. 409 ALREADY_PURCHASED
  buyItem: async (itemId: string, body: BuyWishItemRequest) => {
    await apiClient.post(ENDPOINTS.wishlist.itemBuy(itemId), body);
  },

  // 204. 409 ALREADY_DROPPED
  dropItem: async (itemId: string, type: WishItemType) => {
    await apiClient.post(ENDPOINTS.wishlist.itemDrop(itemId), { type });
  },

  // 백엔드 개발 진행 중 (명세 예시 기준으로 타입 작성)
  getAnalytics: async () =>
    (await apiClient.get<ApiSuccess<WishAnalytics>>(ENDPOINTS.wishlist.analytics)).data.data,

  // 409 DUPLICATE_FOLDER_NAME
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

  // 204
  deleteFolder: async (folderId: string) => {
    await apiClient.delete(ENDPOINTS.wishlist.folder(folderId));
  },

  // 위시(WISHLISTED) 상태 아이템만 내려옴
  getFolderItems: async (folderId: string, params: CursorParams = {}) =>
    (
      await apiClient.get<ApiSuccess<WishItemListResponse>>(
        ENDPOINTS.wishlist.folderItems(folderId),
        { params },
      )
    ).data.data,
};

// ---------- 상품 정보 가져오기 (크롤링) ----------
// 흐름: requestCrawl(url) → jobId → SSE로 done 이벤트 수신 → dataId → getCrawlResult(dataId)
// 결과 API는 SSE에서 받은 dataId가 있어야 호출 가능하므로 폴링으로 대체할 수 없음

export type CrawlEventHandlers = {
  onConnected?: (event: CrawlConnectedEvent) => void;
  onDone: (event: CrawlDoneEvent) => void;
  onError?: (error: Error) => void;
};

// axios/fetch는 RN에서 스트리밍 응답을 읽지 못하므로 XHR의 점진적 responseText로 SSE를 파싱
// 주의: apiClient 인터셉터를 거치지 않아 401 시 토큰 리프레시가 자동으로 되지 않음
export const subscribeCrawlEvents = (jobId: string, handlers: CrawlEventHandlers) => {
  const xhr = new XMLHttpRequest();
  let readIndex = 0; // responseText 중 이미 처리한 위치
  let buffer = "";
  let finished = false;

  const finish = () => {
    finished = true;
    xhr.abort();
  };

  // SSE 이벤트 블록 하나("event: x\ndata: {...}")를 파싱해 핸들러 호출. ":"로 시작하는 줄은 하트비트
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
      // 파싱 불가한 이벤트는 무시
    }
  };

  const consume = () => {
    if (finished) return;
    buffer += xhr.responseText.slice(readIndex);
    readIndex = xhr.responseText.length;
    // 이벤트는 빈 줄로 구분됨. 마지막 조각은 아직 덜 받았을 수 있어 버퍼에 남김
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? "";
    blocks.forEach(dispatch);
  };

  // RN XHR은 send 전에 onprogress/onreadystatechange가 등록돼 있어야 점진적으로 응답을 전달함
  xhr.onprogress = consume;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 3) consume();
    if (xhr.readyState !== 4 || finished) return;
    consume();
    if (buffer.trim()) dispatch(buffer); // 마지막 빈 줄 없이 끝난 경우
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

  // 구독 해제 함수
  return () => {
    if (!finished) finish();
  };
};

export const crawlApi = {
  requestCrawl: async (url: string) =>
    (await apiClient.post<ApiSuccess<CrawlTaskResponse>>(ENDPOINTS.wishlist.crawlTasks, { url }))
      .data.data,

  // cacheId = SSE done 이벤트의 dataId
  getCrawlResult: async (cacheId: string) =>
    (await apiClient.get<ApiSuccess<CrawlResult>>(ENDPOINTS.wishlist.crawlResult(cacheId))).data
      .data,

  // 요청 → SSE 대기 → 결과 조회까지 한 번에 수행. 실패/타임아웃 시 reject
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

// ---------- React Query ----------

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

// 상태 변경(구매/포기/삭제 등) 후 아이템이 나타날 수 있는 목록들을 갱신
const invalidateItemLists = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: wishlistKeys.itemLists }),
    queryClient.invalidateQueries({ queryKey: wishlistKeys.folderItemLists }),
  ]);

// 구매/포기는 소비 금액·로그 기록·도나햄 한마디에도 반영됨
const invalidateSpendingViews = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: goalsKeys.spend }),
    queryClient.invalidateQueries({ queryKey: logKeys.all }),
    queryClient.invalidateQueries({ queryKey: characterKeys.comment }),
  ]);

// 커서 페이지네이션 목록 (data.pages[n].wishitems)
export const useWishItems = (
  params: Omit<WishItemListParams, "cursor"> = {},
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

// 구매/포기: 상태가 바뀌므로 목록·상세·통계 모두 갱신
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

// 폴더 삭제 시 소속 아이템의 폴더 정보가 바뀌므로 위시 캐시 전체 갱신
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

// URL 입력 → 상품 정보까지 한 번에 (요청 + SSE 대기 + 결과 조회)
export const useCrawlProduct = () =>
  useMutation({ mutationFn: (url: string) => crawlApi.crawlProduct(url) });
