


import { useMutation,useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import useStore from "../store";
import { Note , EditedNote } from "../types/types";
import { revalidateList, revalidateSingle } from "../utils/revalidation";

export const useMutateNote = () => {
  const reset = useStore((state) => state.resetEditedNote);
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: async (note: Omit<Note,'id' | 'created_at' | 'user_id' | 'comments'>) => {
      const user = supabase.auth.user();
      if (!user) throw new Error('ユーザーが取得できません（未ログインまたはSSR）');

      const insertPayload = {
        ...note,
        user_id: user.id,
      };
      console.log("送信するデータ:", insertPayload);

      const { data, error } = await supabase
        .from('notes')
        .insert(insertPayload)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      revalidateList();
      reset();
      alert('successfully! completed');
    },
    onError: (error: any) => {
      alert(error.message);
      reset();
    }
  });
  const updateNoteMutation = useMutation({
    mutationFn: async (editedNote: EditedNote) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: editedNote.title,
          content: editedNote.content,
        })
        .eq('id', editedNote.id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
    ,
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      revalidateList();
      revalidateSingle(updatedNote.id);
      reset();
      alert('Updated!');
    }
    ,
    onError: (error: any) => {
      alert(error.message);
      reset();
    }
  });
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id) // 削除するIDを指定
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    ,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      revalidateList();
      revalidateSingle(deletedId);
      reset();
      alert('Deleted');
    }
    ,
    onError: (error: any) => {
      alert(error.message);
      reset();
    }
  });
  return {
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation
  };

}






/*const useMutateNote = () => {
  const reset = useStore((state) => state.resetEditedNote);

  const createNoteMutation = useMutation({
    mutationFn: async (note: Omit<Note, 'created_at' | 'user_id' | 'comments'>) => {
      const user = supabase.auth.user();
      if (!user) throw new Error('ユーザーが取得できません（未ログインまたはSSR）');

      const insertPayload = {
        ...note,
        user_id: user.id,
      };
      console.log("送信するデータ:", insertPayload);

      const { data, error } = await supabase
        .from('notes')
        .insert(insertPayload)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (data) => {
      try {
        await fetch(`/api/revalidate-detail?id=${data.id}&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`);
      } catch (e) {
        console.error('再検証に失敗しました', e);
      }
      revalidateList();
      reset();
      alert('successfully! completed');
    },
    onError: (error: any) => {
      alert(error.message);
      reset();
    }
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (editedNote: EditedNote) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: editedNote.title,
          content: editedNote.content,
        })
        .eq('id', editedNote.id)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async (data) => {
      try {
        await fetch(`/api/revalidate-detail?id=${data.id}&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`);
      } catch (e) {
        console.error('再検証に失敗しました', e);
      }
      reset();
      alert('successfully! completed');
    },
    onError: (error: any) => {
      alert(error.message);
      reset();
    }
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: async (id) => {
      try {
        await fetch(`/api/revalidate-detail?id=${id}&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`);
      } catch (e) {
        console.error('再検証に失敗しました', e);
      }
      revalidateSingle(id);
      reset();
      alert('successfully! completed');
    },
    onError: (error: any) => {
      alert(error.message);
      reset();
    }
  });

  return {
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation
  };
};

export default useMutateNote;

*/

/*const useMutateNote = () => {
    const reset= useStore((state) => state.resetEditedNote);

    const createNoteMutation = useMutation({
        mutationFn: async (note: Omit<Note, 'created_at' | 'user_id' | 'comments'>) => {
            const user = supabase.auth.user();

            if (!user) {
            throw new Error('ユーザーが取得できません（未ログインまたはSSR）');
            }

            const insertPayload = {
                ...note,
                user_id: user.id,
            };

              console.log("送信するデータ:", insertPayload); // ← 必ず確認！

        const { data, error } = await supabase
            .from('notes')
            .insert(insertPayload)
            .select('*')
            .single();
    if (error) {
            throw new Error(error.message);
        }
    return data ;
    },
        onSuccess: () => {
            revalidateList();
            reset();
            alert('successfully! completed');
        },
        onError: (error:any) => {
            alert(error.message )
            reset();
        }
    }
);

    const updateNoteMutation = useMutation({
        mutationFn: async (editedNote: EditedNote) => {
            const { data, error } = await supabase
                .from('notes')
                .update({
                    title: editedNote.title,
                    content: editedNote.content,})
                .eq('id', editedNote.id)
                .select('*')
                .single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        onSuccess: (data) => {
            //revalidateSingle(data.id);
            reset();
            alert('successfully! completed');
        },
        onError: (error:any) => {
            alert('error.message');
            reset();
        }
    });

        const deleteNoteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id);
            if (error) {
                throw new Error(error.message);
            }
            return id;
        },
        onSuccess: (id) => {
            revalidateSingle(id);
            reset();
            alert('successfully! completed');
        },
        onError: (error:any) => {
            alert('error.message');
            reset();
        }
    });
return {
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation

};

}
export default useMutateNote;
*/