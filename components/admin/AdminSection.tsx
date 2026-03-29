import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const AdminSection = ({ title, children }: Props) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
