// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { avatar, femaleAvatar } from "@/config/site";
// import { motion, useInView } from "framer-motion";
// import {
//   Building2,
//   ChevronLeft,
//   ChevronRight,
//   Globe,
//   MapPin,
//   Star,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";

// import "swiper/css";
// import { Navigation } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Swiper as SwiperType } from "swiper/types";

// import { demoDoctors } from "@/data/doctor";
// import { DoctorCardSkeleton } from "../landing-page/doctor-skeleton";
// import { Button } from "../ui/button";

// const BestDoctors = () => {
//   const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
//   const [isLoading] = useState(false);
//   const doctors = demoDoctors;

//   /** Animation */
//   const sectionRef = useRef<HTMLElement | null>(null);

//   const isInView = useInView(sectionRef as React.RefObject<Element>, {
//     once: true,
//     margin: "-100px",
//   });

//   useEffect(() => {
//     const handleResize = () => swiperInstance?.update();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [swiperInstance]);

//   return (
//     <motion.section
//       ref={sectionRef}
//       initial={{ opacity: 0, y: 50 }}
//       animate={isInView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//       aria-labelledby="best-doctors-heading"
//     >
//       <div className="bg-card/50 py-16 lg:py-20">
//         <div className="container space-y-6">
//           {/* Header */}
//           <header className="text-center">
//             <div className="text-3xl md:text-4xl font-bold text-default-800 mb-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2, duration: 0.6 }}
//                 viewport={{ once: true }}
//               >
//                 <h2 id="best-doctors-heading">
//                   Our Expert
//                   <span className="text-blue-600 dark:text-blue-400">
//                     {" "}
//                     Doctors
//                   </span>
//                 </h2>
//               </motion.div>
//             </div>

//             <div className="text-lg text-default-600 max-w-2xl mx-auto">
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//                 viewport={{ once: true }}
//               >
//                 Book appointments with our top-rated healthcare professionals
//               </motion.p>
//             </div>
//           </header>

//           {/* Navigation */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => swiperInstance?.slidePrev()}
//                 className="nav-btn hover:scale-105 active:scale-95 transition-transform duration-200"
//                 aria-label="Previous doctors"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>

//               <button
//                 onClick={() => swiperInstance?.slideNext()}
//                 className="nav-btn hover:scale-105 active:scale-95 transition-transform duration-200"
//                 aria-label="Next doctors"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </motion.div>

//           {/* Carousel */}
//           <Swiper
//             slidesPerView="auto"
//             spaceBetween={24}
//             speed={800}
//             loop={true}
//             modules={[Navigation]}
//             grabCursor={true}
//             breakpoints={{
//               1536: { slidesPerView: 3 },
//               1280: { slidesPerView: 3 },
//               768: { slidesPerView: 2 },
//               0: { slidesPerView: 1 },
//             }}
//             onSwiper={setSwiperInstance}
//             className="!py-2"
//           >
//             {isLoading
//               ? Array.from({ length: 3 }).map((_, i) => (
//                   <SwiperSlide key={i} className="!h-auto">
//                     <DoctorCardSkeleton />
//                   </SwiperSlide>
//                 ))
//               : doctors.map((doctor: any, index: number) => (
//                   <SwiperSlide key={doctor.id} className="!h-auto">
//                     <article
//                       className="group h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col animate-fade-in-up"
//                       style={{
//                         animationDelay: `${index * 0.1}s`,
//                         animationFillMode: "both",
//                       }}
//                     >
//                       {/* Doctor Image */}
//                       <figure className="relative rounded-lg overflow-hidden">
//                         {doctor?.user?.image ? (
//                           <div className="relative w-full h-72 p-2 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 aspect-square">
//                             <Image
//                               src={
//                                 doctor?.gender === "MALE"
//                                   ? avatar
//                                   : femaleAvatar
//                               }
//                               alt={`Dr. ${doctor?.user?.name}`}
//                               fill
//                               className="object-cover transition-transform duration-300 group-hover:scale-105"
//                               sizes="(max-width: 768px) 100vw, 128px"
//                             />
//                           </div>
//                         ) : (
//                           <div className="relative w-full h-72 p-2 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 aspect-square">
//                             <Image
//                               src={
//                                 doctor?.gender === "MALE"
//                                   ? avatar
//                                   : femaleAvatar
//                               }
//                               alt={`Dr. ${doctor?.user?.name}`}
//                               fill
//                               className="object-cover transition-transform duration-300 group-hover:scale-105"
//                               sizes="(max-width: 768px) 100vw, 128px"
//                             />
//                           </div>
//                         )}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                         <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:scale-105 transition-transform duration-200">
//                           <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
//                           <span
//                             itemProp="aggregateRating"
//                             itemScope
//                             itemType="https://schema.org/AggregateRating"
//                           >
//                             <span
//                               itemProp="ratingValue"
//                               className="text-gray-800 dark:text-gray-100"
//                             >
//                               {doctor?.averageRating || "0"}
//                             </span>
//                           </span>
//                         </div>
//                       </figure>

//                       {/* Info */}
//                       <div className="p-5">
//                         <Link
//                           href={`/doctors/${doctor?.id}`}
//                           className="block text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
//                         >
//                           ডাঃ {doctor?.user?.name}
//                         </Link>

//                         {/* Specializations */}
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                           {doctor?.specializations
//                             ?.map((sp: { name: any }) => sp.name)
//                             .join(", ")}
//                         </p>

//                         <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
//                           {doctor?.degree}
//                         </p>

//                         {/* Hospital */}
//                         <div className="flex items-start gap-2 mt-3">
//                           <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
//                           <span className="text-sm text-gray-700 dark:text-gray-300">
//                             {doctor?.hospital}
//                           </span>
//                         </div>

//                         {/* Review Count */}
//                         <div className="flex items-center gap-2 mt-3">
//                           <div className="rating-pill hover:scale-105 transition-transform duration-200">
//                             <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
//                             {doctor?.averageRating || 0}
//                           </div>
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             ({doctor?.reviewsCount || 0} reviews)
//                           </span>
//                         </div>
//                       </div>

//                       {/* Buttons */}
//                       <div className="mt-auto p-4">
//                         <div className="flex flex-col sm:flex-row gap-3">
//                           <Button
//                             variant="soft"
//                             size="sm"
//                             className="w-full hover:scale-[1.02] active:scale-95 transition-transform duration-200"
//                           >
//                             <Globe className="w-4 h-4" />
//                             <Link href={`/doctors/${doctor.id}#website`}>
//                               Website
//                             </Link>
//                           </Button>

//                           <Button
//                             size="sm"
//                             className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-200"
//                           >
//                             <Building2 className="w-4 h-4" />
//                             <Link href={`/doctors/${doctor.id}#chambers`}>
//                               Chambers
//                             </Link>
//                           </Button>
//                         </div>
//                       </div>
//                     </article>
//                   </SwiperSlide>
//                 ))}
//           </Swiper>

//           {/* CTA */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.8 }}
//             viewport={{ once: true }}
//           >
//             <div className="text-center">
//               <Link
//                 href="/doctors"
//                 className="inline-flex items-center gap-2 text-primary font-semibold hover:underline hover:gap-3 transition-all duration-300"
//               >
//                 View All Doctors
//                 <ChevronRight className="w-4 h-4 transition-transform duration-300 hover:translate-x-1" />
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </motion.section>
//   );
// };

// export default BestDoctors;
