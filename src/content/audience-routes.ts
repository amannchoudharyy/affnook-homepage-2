import { AUDIENCES, DEFAULT_AUDIENCE, listAudiences, type AudienceId } from './audiences';

/** Maps a pathname to the audience it renders (falls back to the default audience). */
export function audienceFromPathname(pathname: string | null | undefined): AudienceId {
  const clean = (pathname ?? '/').replace(/\/+$/, '') || '/';
  const match = listAudiences().find((a) => a.path === clean);
  return match ? match.id : DEFAULT_AUDIENCE;
}

export function isAudiencePath(pathname: string | null | undefined): boolean {
  const clean = (pathname ?? '/').replace(/\/+$/, '') || '/';
  return listAudiences().some((a) => a.path === clean);
}

export function audiencePath(id: AudienceId): string {
  return AUDIENCES[id].path;
}
