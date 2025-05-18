import { useSearchParams } from 'react-router-dom';

const FALLBACK_PAGE = 1;
const FALLBACK_LIMIT = 10;

export const usePaginate = () => {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page')) || FALLBACK_PAGE;
  const limit = Number(params.get('limit')) || FALLBACK_LIMIT;

  const setPage = (p: number) => {
    params.set('page', String(p));
    setParams(params, { replace: true });
  };

  const setLimit = (l: number) => {
    params.set('limit', String(l));
    params.set('page', '1'); // รีเซ็ตกลับหน้าแรก
    setParams(params, { replace: true });
  };

  return { page, limit, setPage, setLimit };
};
