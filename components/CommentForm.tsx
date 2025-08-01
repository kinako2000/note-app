import { FormEvent, FC } from "react"
import { supabase } from "../utils/supabase"
import useStore from "../store"
import { useMutateComment } from "../hooks/useMutateComment"
import { Spinner } from "./Spinner"

export const CommentForm: FC<{ noteId: string}> = ({ noteId }) => {
    const { editedComment} = useStore();
    const update = useStore((state) => state.updateEditedComment);
    const { createCommentMutation, updateCommentMutation } = useMutateComment();
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if(editedComment.id === "") {
            createCommentMutation.mutate({
                content: editedComment.content,
                user_id: supabase.auth.user()?.id ??  "",
                note_id: noteId,
            });
            }else {
            updateCommentMutation.mutate({
                id: editedComment.id,
                content: editedComment.content,
                user_id: supabase.auth.user()?.id ?? "",
                note_id: noteId,
            })};
        };
        if (createCommentMutation.isPending || updateCommentMutation.isPending) {
            return <Spinner />;
        }
    return (
    <form onSubmit={submitHandler}>
        <input
        type="text"
        className="my-2 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:border-indigo-500"
        placeholder="new comment"
        value={editedComment.content}
        onChange={(e) => update({ ...editedComment, content: e.target.value })}
        />
    <button
        type="submit"
        className="ml-2 rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
    >
        {editedComment.id === "" ? "Send" : "Update"}
    </button>
    </form>
);
}
