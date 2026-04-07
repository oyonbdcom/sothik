import { Button } from "@/components/ui/button";

export const OTPCountdown = ({ onResend }: { onResend: () => void }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onResend}
      className="text-blue-600 hover:text-blue-700"
    >
      Resend OTP
    </Button>
  );
};
