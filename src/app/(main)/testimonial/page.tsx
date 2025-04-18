import CardTestimony from "@/components/features/testimoni/card-testimony";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const data = [
  {
    id: "1",
    img: "https://shadcnblocks.com/images/block/avatar-1.webp",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa, eveniet inventore! Omnis incidunt vel iste.",
    name: "john doe",
    company: "CEO, Company Name",
  },
  {
    id: "2",
    img: "https://shadcnblocks.com/images/block/avatar-1.webp",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa, eveniet inventore! Omnis incidunt vel iste.",
    name: "john doe",
    company: "CEO, Company Name",
  },
  {
    id: "3",
    img: "https://shadcnblocks.com/images/block/avatar-1.webp",
    desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa, eveniet inventore! Omnis incidunt vel iste.",
    name: "john doe",
    company: "CEO, Company Name",
  },
];

const Testimonial4 = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col gap-6 ">
          <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-4 mb-11">
            <Image width={200} height={200} src="https://shadcnblocks.com/images/block/placeholder-1.svg" alt="placeholder" className="h-72 w-full rounded-md object-cover lg:h-auto" />
            <Card className="col-span-2 flex items-center justify-center p-6 ">
              <div className="flex flex-col gap-4">
                <q className="text-xl font-medium lg:text-3xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque eveniet suscipit corporis sequi usdam alias fugiat iusto perspiciatis.</q>
                <div className="flex flex-col items-start">
                  <p>John Doe</p>
                  <p className="text-muted-foreground">CEO, Company Name</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {data.map((item) => (
              <CardTestimony key={item.id} img={item.img} desc={item.desc} company={item.company} name={item.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial4;
