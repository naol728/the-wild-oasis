import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { Textarea } from "../../ui/Textarea";
import { useForm, useFormState } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";
const Label = styled.label`
  font-weight: 500;
`;
function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editcabin } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, control } = useForm({
    defaultValues: isEditSession ? editcabin : {},
  });
  const { errors } = useFormState({ control });
  const { createCabin, isCreating } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  function onSubmit(data) {
    const image = typeof data.image == "string" ? data.image : data.image[0];

    if (isEditSession)
      editCabin(
        { newCabindata: { ...data, image: image }, id: editId },
        {
          onSuccess: () => reset(),
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => reset(),
        }
      );
  }

  const isWorking = isEditing || isCreating;
  function onError(error) {
    console.log(error);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "this field  is required",
          })}
        />
      </FormRow>

      <FormRow label="maxCapacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "this field is required",
            min: {
              value: 1,
              message: "min value is  1",
            },
          })}
        />
      </FormRow>

      <FormRow error={errors?.regularPrice?.message} label="regularPrice">
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "this field is required",
            min: {
              value: 1,
              message: "min value is  1",
            },
          })}
        />
      </FormRow>

      <FormRow label="discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          {...register("discount", {
            required: "this field is required",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "The discout should be less than the regular value ",
          })}
          defaultValue={0}
        />
      </FormRow>

      <FormRow label="description" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", {
            required: "the description is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id="image"
          type="file"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is Required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {" "}
          {isEditSession ? "Edit Cabin" : "Add cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
