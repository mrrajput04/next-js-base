export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Next.js Base App';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_TAGLINE || 'Next.js scaffolding for AI applications';

export const getPageTitle = (pageName?: string) => {
  return pageName ? `${APP_NAME} - ${pageName}` : APP_NAME;
};