import Image from "next/image";

export default function AboutUs() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6">Our Story</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed alias repellendus perferendis earum facilis est soluta consequatur placeat hic atque exceptationem, ex molestias nam veniam distinctio maxime culpa magnam autem.
            </p>
            <p className="text-gray-700">
              Nulla facilisi. Phasellus vel est vel augue convallis maximus. Sed placerat euismod nibh vitae tempor amet, amet leo et ipsum, pharetra exercitationem nisi, euismod dictum tellus eleifend consectetur elit. Quo molestiae ipsa
              quam voluptates, quisquis non enim, quod sapiente doloribus repudiandae vel ipsum mollis lacinia nisi perferendis! Qui illo molestum blandit!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Image src="https://unsplash.com/photos/a-woman-with-tattoos-gazes-at-the-camera-eLybwcjUr_E" alt="Office space" width={400} height={600} className="rounded-lg object-cover h-full w-full" />
            <div className="grid grid-rows-2 gap-4">
              <Image src="/placeholder.svg?height=290&width=290" alt="Motivational sign" width={290} height={290} className="rounded-lg object-cover h-full w-full" />
              <Image src="/placeholder.svg?height=290&width=290" alt="Plant decoration" width={290} height={290} className="rounded-lg object-cover h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="grid grid-rows-2 gap-4">
          <Image src="/placeholder.svg?height=300&width=500" alt="Team working together" width={500} height={300} className="rounded-lg object-cover h-full w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Image src="/placeholder.svg?height=240&width=240" alt="Person on phone" width={240} height={240} className="rounded-lg object-cover h-full w-full" />
            <Image src="/placeholder.svg?height=240&width=240" alt="Person working on laptop" width={240} height={240} className="rounded-lg object-cover h-full w-full" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Our Workplace</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit quas vel rem tempur illum aspernatur. Ea, facere soluta cumque labor quam repudiandae quaerat inventore dolores saepe pariatur, adipisci atque voluptate
              doloribus!
            </p>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste atque suscipiunt officia distinctio exercitationem quia non nisi! Expedita quasi, beatae assumenda ex recusandae soluta dividen. Natus repellendus culpam aliquam
              temporibus!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
