export class CreateRouteDto {
  name: string;
  description: string;
  vendor: { name: string; contactNumber: string };
  driver: { name: string; contactNumber: string };
  cab: { model: string; number: string };
}
