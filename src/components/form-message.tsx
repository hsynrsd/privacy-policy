export type Message = {
  type: "success" | "error";
  text: string;
};

type FormMessageProps = {
  message: Message;
  role?: string;
  "aria-live"?: "polite" | "assertive" | "off";
};

export function FormMessage({ message, role = "alert", "aria-live": ariaLive = "polite" }: FormMessageProps) {
  const styles = {
    success: "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  return (
    <div 
      className={`p-4 rounded-md ${styles[message.type]}`}
      role={role}
      aria-live={ariaLive}
    >
      {message.text}
    </div>
  );
}
