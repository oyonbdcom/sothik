"use client";

import { useMounted } from "@/hooks/use-mounted";
import Loader from "./loader";
const LayoutLoader = () => {
  const mounted = useMounted();
  if (!mounted) return null;
  return <Loader />;
};

export default LayoutLoader;
