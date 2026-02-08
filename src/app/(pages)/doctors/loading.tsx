import LayoutLoader from "@/components/layout-loader";

export default function loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <LayoutLoader />
    </div>
  );
}
