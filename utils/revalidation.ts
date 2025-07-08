/*export const revalidateList = () => {
    fetch('/api/revalidate')
}

export const revalidateSingle = (id: string) => {
    fetch(`/api/revalidate/${id}`)
}*/

// utils/revalidation.ts


export const revalidateList = async () => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'list',
          secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET, // ✅ 修正
        }),
      });
    } catch (error) {
      console.error('リスト再検証に失敗しました:', error);
    }
  };
  
  export const revalidateSingle = async (id: string) => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'single',
          id,
          secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET, // ✅ 修正
        }),
      });
    } catch (error) {
      console.error(`再検証失敗: ${error}`);
    }
  };
  