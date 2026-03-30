"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteUser } from "@/app/actions/actions";

type DeleteButtonProps = {
  id: string;
  email?: string;
};

export default function DeleteButton({ id, email }: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // function handleDelete() {
  //   startTransition(async () => {
  //     try {
  //       const result = await deleteUser(id);
  //       toast.success(result.message || "Xoa user thanh cong", {
  //         description: email ? `User: ${email}` : undefined,
  //       });
  //       router.refresh();
  //     } catch (error) {
  //       const message =
  //         error instanceof Error ? error.message : "Xoa user that bai";
  //       toast.error("Xoa user that bai", {
  //         description: message,
  //       });
  //     }
  //   });
  // }
function handleDelete() {
    startTransition(async () => {
      const promise = deleteUser(id).then((result) => {
        router.refresh();
        return result;
      });

      toast.promise(promise, {
        loading: "Đang xóa người dùng...",
        success: (result) => {
          return result.message || `Đã xóa thành công ${email || 'user'}!`;
        },
        error: (err) => {
          return err.message || "Xóa user thất bại!";
        },
      });
    });
  }
  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex h-7 items-center rounded-md border border-red-300 bg-red-50 px-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Dang xoa..." : "Xóa"}
    </button>
  );
}
