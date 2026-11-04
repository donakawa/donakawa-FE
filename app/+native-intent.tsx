// 소셜 인증 결과 딥링크(donakawa://...)는 openAuthSessionAsync가 직접 처리하므로
// expo-router가 없는 경로로 이동하지 않도록 막음
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  if (!path.startsWith("donakawa://")) return path;
  return initial ? "/" : null;
}
