import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabindata, id }) => createEditCabin(newCabindata, id),
    onSuccess: () => {
      toast.success(" Cabin Edited sucessfully");
      queryClient.invalidateQueries({
        queryKey: ["cabin"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { editCabin, isEditing };
}
