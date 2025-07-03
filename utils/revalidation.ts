/*export const revalidateList = () => {
    fetch('/api/revalidate')
}

export const revalidateSingle = (id: string) => {
    fetch(`/api/revalidate/${id}`)
}*/

// utils/revalidation.ts

/**
 * /notes ページのISRを再生成する（一覧用）
 */
export const revalidateList = async () => {
    try {
        await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: 'list',
            secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        }),
        });
    } catch (error) {
        console.error('リスト再検証に失敗しました:', error);
    }
    };

    /**
   * /notes/[id] ページのISRを再生成する（詳細ページ用）
   * @param id ノートのID
   */
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
            secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        }),
        });
    } catch (error) {
        console.error(`ノートID ${id} の再検証に失敗しました:`, error);
    }
    };
