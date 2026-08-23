import { ColorValue } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  AlertIcon,
  AlertTriangle,
  ArrowLeft01FreeIcons,
  ArrowRight02FreeIcons,
  Book01Icon,
  Camera01Icon,
  Contact01Icon,
  DashboardSquare01Icon,
  EyeClosedIcon,
  EyeIcon,
  Home07Icon,
  InfoIcon,
  Logout01Icon,
  MenuIcon,
  MoneySend01Icon,
  Shield01Icon,
  UserCircle02Icon,
  UserRemove01Icon,
  UserUnlock01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@utils/helpers';

export type IconName =
  | 'eye-open'
  | 'eye-close'
  | 'user-unlock'
  | 'arrow-right'
  | 'arrow-left'
  | 'menu'
  | 'info'
  | 'information-circle'
  | 'camera-01'
  | 'money-send-01'
  | 'home'
  | 'user-01'
  | 'cancel-circle'
  | 'logout-01'
  | 'alert-triangle'
  | 'contact-01'
  | 'alert-circle'
  | 'book-01'
  | 'shield';

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  className?: string;
};

const getHugeIcon = (name: IconName) => {
  switch (name) {
    case 'eye-open':
      return EyeIcon;
    case 'eye-close':
      return EyeClosedIcon;
    case 'user-unlock':
      return UserUnlock01Icon;
    case 'arrow-right':
      return ArrowRight02FreeIcons;
    case 'arrow-left':
      return ArrowLeft01FreeIcons;
    case 'info':
      return InfoIcon;
    case 'menu':
      return MenuIcon;
    case 'alert-circle':
      return AlertIcon;
    case 'alert-triangle':
      return AlertTriangle;
    case 'information-circle':
      return DashboardSquare01Icon;
    case 'camera-01':
      return Camera01Icon;
    case 'money-send-01':
      return MoneySend01Icon;
    case 'cancel-circle':
      return UserRemove01Icon;
    case 'user-01':
      return UserCircle02Icon;
    case 'home':
      return Home07Icon;
    case 'logout-01':
      return Logout01Icon;
    case 'contact-01':
      return Contact01Icon;
    case 'book-01':
      return Book01Icon;
    case 'shield':
      return Shield01Icon;
    default:
      return MenuIcon;
  }
};

export const Icon = ({ name, size, className, color }: Props) => {
  return (
    <HugeiconsIcon
      color={color}
      icon={getHugeIcon(name)}
      size={size || 24}
      className={cn('', className)}
    />
  );
};
