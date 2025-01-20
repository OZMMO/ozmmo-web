import { FieldErrors } from "../create-safe-action";

export default interface UserFormProps<T, TInput, TInfoExtra> {
  initialData?: T | null;
  onSubmit?: (data: TInput) => void;
  errors?: FieldErrors<TInput> ;
  infoExtra?: TInfoExtra
}
