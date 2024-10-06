import db from "@/lib/db";

export const getCategoryById = async (id: string) => {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });

    return category;
  } catch {
    return null;
  }
};
