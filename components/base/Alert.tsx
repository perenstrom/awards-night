import { Severity } from 'types/utilityTypes';

type Props = {
  severity: Severity;
  message: string;
};

export const Alert = (props: Props) => {
  const getColorClasses = (severity: Severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-900';
      case 'warning':
        return 'bg-orange-100 text-orange-900';
      case 'info':
        return 'bg-blue-100 text-blue-900';
      case 'success':
        return 'bg-lime-50 text-lime-900';

      default:
        break;
    }
  };

  return (
    <div className={`rounded-sm flex ${getColorClasses(props.severity)} p-4`}>
      {props.message}
    </div>
  );
};
