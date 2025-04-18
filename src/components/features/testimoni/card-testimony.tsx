import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const CardTestimony = ({ img, desc, name, company }: { img: string; desc: string; name: string; company: string }) => {
  return (
    <Card className="pt-0">
      <CardContent className="px-6 leading-7 text-foreground/70 ">
        <Avatar className="relative size-20 rounded-full ring-1 ring-input mx-auto -top-10 border-4 border-primary">
          <AvatarImage src={img} alt="placeholder" />
        </Avatar>
        <q className="">{desc}</q>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 leading-5">
          <div className="text-sm">
            <p className="font-medium">{name}</p>
            <p className="text-muted-foreground">{company}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardTestimony;
