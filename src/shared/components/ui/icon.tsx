import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  AlertIcon,
  AlertTriangle,
  ArrowLeft01FreeIcons,
  ArrowRight02FreeIcons,
  EyeClosedIcon,
  EyeIcon,
  InfoIcon,
  MenuIcon,
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
  | 'alert-triangle'
  | 'alert-circle';

type Props = {
  name: IconName;
  size?: number;
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
    default:
      return MenuIcon;
  }
};

export const Icon = ({ name, size, className }: Props) => {
  return <HugeiconsIcon icon={getHugeIcon(name)} size={size || 24} className={cn('', className)} />;
};
