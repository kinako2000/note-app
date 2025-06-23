import { useMutation } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import useStore from "../store";
import { Comment, EditedComment } from "../types/types";
import { revalidateSingle } from "../utils/revalidation";


export const useMutateComment = () => {
const reset = useStore((state) => state.resetEditedComment)
const createCommentMutation = useMutation({
    mutationFn: async (comment: Omit<Comment,'id' | 'created_at' | 'user_id'>) => {
        const { data, error } = await supabase
            .from('comments')
            .insert(comment)
            .select('*')
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    onSuccess: (res) => {
        revalidateSingle(res[0].note_id);
        reset();
        alert('Comment added successfully!');
    },
    onError: (error: any) => {
        alert(error.message);
        reset();
    }
});

const updateCommentMutation = useMutation({
    mutationFn: async (editedComment: EditedComment) => {
        const { data, error } = await supabase
            .from('comments')
            .update({ content: editedComment.content })
            .eq('id', editedComment.id)
            .select('*')
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    onSuccess: (res) => {
        revalidateSingle(res[0].note_id);
        reset();
        alert('Comment updated successfully!');
    },
    onError: (error: any) => {
        alert(error.message);
        reset();
    }
})

const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)
            .select('*')
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    onSuccess: (res) => {
        revalidateSingle(res[0].note_id);
        alert('Comment deleted successfully!');
    },
    onError: (error: any) => {
        alert(error.message);
    }
});
return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation
}};


