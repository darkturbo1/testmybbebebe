import hogwartsImg from "@/assets/destinations/hogwarts.jpg";
import mordorImg from "@/assets/destinations/mordor.jpg";
import narniaImg from "@/assets/destinations/narnia.jpg";
import rivendellImg from "@/assets/destinations/rivendell.jpg";
import asgardImg from "@/assets/destinations/asgard.jpg";
import wakandaImg from "@/assets/destinations/wakanda.jpg";

export interface Destination {
  id: string;
  name: string;
  franchise: string;
  distance: number; // in km
  description: string;
  image: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Epic";
  estimatedDays: number;
}

export const destinations: Destination[] = [
  {
    id: "hogwarts",
    name: "Hogwarts",
    franchise: "Harry Potter",
    distance: 50,
    description: "Journey to the School of Witchcraft and Wizardry. Cross the Scottish Highlands to reach the magical castle.",
    image: hogwartsImg,
    difficulty: "Easy",
    estimatedDays: 7,
  },
  {
    id: "narnia",
    name: "Narnia",
    franchise: "The Chronicles of Narnia",
    distance: 100,
    description: "Step through the wardrobe and run through the magical lands of Narnia to reach Cair Paravel.",
    image: narniaImg,
    difficulty: "Medium",
    estimatedDays: 14,
  },
  {
    id: "rivendell",
    name: "Rivendell",
    franchise: "The Lord of the Rings",
    distance: 200,
    description: "Travel through the Misty Mountains to reach the Last Homely House, sanctuary of the Elves.",
    image: rivendellImg,
    difficulty: "Medium",
    estimatedDays: 28,
  },
  {
    id: "mordor",
    name: "Mordor",
    franchise: "The Lord of the Rings",
    distance: 470,
    description: "One does not simply walk into Mordor. But you can run there! Follow Frodo's path to Mount Doom.",
    image: mordorImg,
    difficulty: "Hard",
    estimatedDays: 60,
  },
  {
    id: "asgard",
    name: "Asgard",
    franchise: "Marvel / Norse Mythology",
    distance: 750,
    description: "Cross the Bifrost Rainbow Bridge and ascend to the realm of the Gods.",
    image: asgardImg,
    difficulty: "Epic",
    estimatedDays: 100,
  },
  {
    id: "wakanda",
    name: "Wakanda",
    franchise: "Black Panther",
    distance: 1000,
    description: "Journey across Africa to find the hidden kingdom of Wakanda. Wakanda Forever!",
    image: wakandaImg,
    difficulty: "Epic",
    estimatedDays: 140,
  },
];
