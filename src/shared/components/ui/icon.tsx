import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01FreeIcons,
  ArrowRight02FreeIcons,
  EyeClosedIcon,
  EyeIcon,
  InfoIcon,
  MenuIcon,
  UserUnlock01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@utils/helpers';

type Name =
  'eye-open' | 'eye-close' | 'user-unlock' | 'arrow-right' | 'arrow-left' | 'menu' | 'info';

type Props = {
  name: Name;
  size?: number;
  className?: string;
};

const getHugeIcon = (name: Name) => {
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
  }
};

export const Icon = ({ name, size, className }: Props) => {
  return <HugeiconsIcon icon={getHugeIcon(name)} size={size || 24} className={cn('', className)} />;
};
