const pokerCards = [
  {
    card: "HA",
    image: new URL("/src/assets/images/ace_of_hearts.png", import.meta.url)
      .href,
  },
  {
    card: "H2",
    image: new URL("/src/assets/images/2_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H3",
    image: new URL("/src/assets/images/3_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H4",
    image: new URL("/src/assets/images/4_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H5",
    image: new URL("/src/assets/images/5_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H6",
    image: new URL("/src/assets/images/6_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H7",
    image: new URL("/src/assets/images/7_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H8",
    image: new URL("/src/assets/images/8_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H9",
    image: new URL("/src/assets/images/9_of_hearts.png", import.meta.url).href,
  },
  {
    card: "H10",
    image: new URL("/src/assets/images/10_of_hearts.png", import.meta.url).href,
  },
  {
    card: "HJ",
    image: new URL("/src/assets/images/jack_of_hearts.png", import.meta.url)
      .href,
  },
  {
    card: "HQ",
    image: new URL("/src/assets/images/queen_of_hearts.png", import.meta.url)
      .href,
  },
  {
    card: "HK",
    image: new URL("/src/assets/images/king_of_hearts.png", import.meta.url)
      .href,
  },
  {
    card: "DA",
    image: new URL("/src/assets/images/ace_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D2",
    image: new URL("/src/assets/images/2_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D3",
    image: new URL("/src/assets/images/3_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D4",
    image: new URL("/src/assets/images/4_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D5",
    image: new URL("/src/assets/images/5_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D6",
    image: new URL("/src/assets/images/6_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D7",
    image: new URL("/src/assets/images/7_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D8",
    image: new URL("/src/assets/images/8_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D9",
    image: new URL("/src/assets/images/9_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "D10",
    image: new URL("/src/assets/images/10_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "DJ",
    image: new URL("/src/assets/images/jack_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "DQ",
    image: new URL("/src/assets/images/queen_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "DK",
    image: new URL("/src/assets/images/king_of_diamonds.png", import.meta.url)
      .href,
  },
  {
    card: "CA",
    image: new URL("/src/assets/images/ace_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C2",
    image: new URL("/src/assets/images/2_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C3",
    image: new URL("/src/assets/images/3_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C4",
    image: new URL("/src/assets/images/4_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C5",
    image: new URL("/src/assets/images/5_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C6",
    image: new URL("/src/assets/images/6_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C7",
    image: new URL("/src/assets/images/7_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C8",
    image: new URL("/src/assets/images/8_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C9",
    image: new URL("/src/assets/images/9_of_clubs.png", import.meta.url).href,
  },
  {
    card: "C10",
    image: new URL("/src/assets/images/10_of_clubs.png", import.meta.url).href,
  },
  {
    card: "CJ",
    image: new URL("/src/assets/images/jack_of_clubs.png", import.meta.url)
      .href,
  },
  {
    card: "CQ",
    image: new URL("/src/assets/images/queen_of_clubs.png", import.meta.url)
      .href,
  },
  {
    card: "CK",
    image: new URL("/src/assets/images/king_of_clubs.png", import.meta.url)
      .href,
  },
  {
    card: "SA",
    image: new URL("/src/assets/images/ace_of_spades.png", import.meta.url)
      .href,
  },
  {
    card: "S2",
    image: new URL("/src/assets/images/2_of_spades.png", import.meta.url).href,
  },
  {
    card: "S3",
    image: new URL("/src/assets/images/3_of_spades.png", import.meta.url).href,
  },
  {
    card: "S4",
    image: new URL("/src/assets/images/4_of_spades.png", import.meta.url).href,
  },
  {
    card: "S5",
    image: new URL("/src/assets/images/5_of_spades.png", import.meta.url).href,
  },
  {
    card: "S6",
    image: new URL("/src/assets/images/6_of_spades.png", import.meta.url).href,
  },
  {
    card: "S7",
    image: new URL("/src/assets/images/7_of_spades.png", import.meta.url).href,
  },
  {
    card: "S8",
    image: new URL("/src/assets/images/8_of_spades.png", import.meta.url).href,
  },
  {
    card: "S9",
    image: new URL("/src/assets/images/9_of_spades.png", import.meta.url).href,
  },
  {
    card: "S10",
    image: new URL("/src/assets/images/10_of_spades.png", import.meta.url).href,
  },
  {
    card: "SJ",
    image: new URL("/src/assets/images/jack_of_spades.png", import.meta.url)
      .href,
  },
  {
    card: "SQ",
    image: new URL("/src/assets/images/queen_of_spades.png", import.meta.url)
      .href,
  },
  {
    card: "SK",
    image: new URL("/src/assets/images/king_of_spades.png", import.meta.url)
      .href,
  },
];

export default pokerCards;

export { pokerCards };
