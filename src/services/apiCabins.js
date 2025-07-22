import supabase from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.log(error);
    throw new Error("can not get all cabins ");
  }
  return data;
}
export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);
  const hasImage =
    typeof newCabin.image === "string" &&
    newCabin.image?.startsWith(import.meta.env.VITE_SUPABASE_URL);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImage
    ? newCabin.image
    : `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/cabins-image/${imageName}`;

  let query = supabase.from("cabins");

  // 1)insert data into te cabin

  if (!id)
    query = await query
      .insert([{ ...newCabin, image: imagePath }])
      .select()
      .single();
  if (id)
    query = await query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = query;
  if (error) {
    console.log(error);
    throw new Error("can not create  cabin ");
  }
  // 2) uploading image into the storage
  const { error: storageError } = await supabase.storage
    .from("cabins-image")
    .upload(imageName, newCabin.image);
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error(
      "cabin image can not be uploaded and Cabin was not  created"
    );
  }
  return data;
}
export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.log(error);
    throw new Error("Cabine is not deleted");
  }
}
