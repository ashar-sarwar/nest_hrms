import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class AuthResponseDto {
  access_token: string;
  user: UserResponseDto;
}
