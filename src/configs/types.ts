/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export const TYPES = {
  UserService: Symbol('UserService'),
  UserController: Symbol('UserController'),
  UserRepository: Symbol('UserRepository'),

  RoleRepository: Symbol('RoleRepository'),
  
  DiAuthService: Symbol('DiAuthService'),
  AuthService: Symbol('AuthService'),
  AuthController: Symbol('AuthController'),
  FileUploadController: Symbol('FileUploadController'),
  FileUploadService: Symbol('FileUploadService'),
  S3FileUploadService: Symbol('S3FileUploadService'),
  RoleService: Symbol('RoleService'),
  
};
