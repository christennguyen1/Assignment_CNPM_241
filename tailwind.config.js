// tailwind.config.js
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#212121",
      },
      fontFamily: {
        sans: ["Poppins_Regular", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        poppins_black: ["Poppins_Black", "sans-serif"],
        poppins_blackitalic: ["Poppins_BlackItalic", "sans-serif"],
        poppins_bold: ["Poppins_Bold", "sans-serif"],
        poppins_bolditalic: ["Poppins_BoldItalic", "sans-serif"],
        poppins_extrabold: ["Poppins_ExtraBold", "sans-serif"],
        poppins_extrabolditalic: ["Poppins_ExtraBoldItalic", "sans-serif"],
        poppins_italic: ["Poppins_Italic", "sans-serif"],
        poppins_light: ["Poppins_Light", "sans-serif"],
        poppins_lightitalic: ["Poppins_LightItalic", "sans-serif"],
        poppins_medium: ["Poppins_Medium", "sans-serif"],
        poppins_mediumitalic: ["Poppins_MediumItalic", "sans-serif"],
        poppins_semibold: ["Poppins_SemiBold", "sans-serif"],
        poppins_semibolditalic: ["Poppins_SemiBoldItalic", "sans-serif"],
        poppins_thin: ["Poppins_Thin", "sans-serif"],
        poppins_thinitalic: ["Poppins_ThinItalic", "sans-serif"]
      },
      gridColumn: {
        'span-24': 'span 24 / span 24',
        '24': '24',
      },
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
});