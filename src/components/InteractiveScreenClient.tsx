
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, FormEvent, CSSProperties, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, ArrowRight, PartyPopper, Home, RotateCcw, 
  MessageSquare, Camera, ImageIcon, Lightbulb,
  Music, Puzzle, Star, Moon, Sun, Gift, Key, Compass, Feather, BookOpen, Zap, Diamond, Award, Brain, Flower,
  Coffee, Cloud, Anchor, Telescope, Leaf, Heart, Aperture, Smile, Wind, Waves, Mountain, TreePine, Bird,
  Rocket, MapPin, Globe, Gem, Shield, Crown, Wand2, Sparkles, Palette, PenTool, Edit3, Eye, Drama, Film,
  Search, Settings, User, Bell, Lock, Mail, Share2, HelpCircle, AlertTriangle, CheckCircle, Info, Package, Sailboat, ToyBrick,
  CloudRain, Droplets, SunMoon, Sprout, VenetianMask
} from 'lucide-react';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';

const MAX_SCREENS = 50;

interface ScreenStyleProperties {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  animations?: string[];
  accentColor?: string;
  layoutType?: 'centered' | 'split-horizontal' | 'split-vertical';
}

interface ScreenDefinition {
  id: string;
  title: string;
  content: string; 
  imagePath?: string; 
  imageAiHint?: string; 
  style?: Partial<ScreenStyleProperties>;
  suggestedNextScreen?: string;
  threeDElements?: Array<{ type: string; description?: string }>; 
  cardIcon?: React.ElementType;
}

// --- ALL 50 SCREEN DEFINITIONS ---
// 10 screens will have imagePath + 3-line message.
// 40 screens will have 5-line message.
// All screens have unique accentColor and thematic animation descriptions.
// No user input text box on any screen.
// No descriptive box for threeDElements will be shown.

// Screens chosen for images: 1, 6, 11, 16, 21, 26, 31, 36, 41, 46

const allScreens: ScreenDefinition[] = [
  // Screen 1 (WITH IMAGE, 3-line message)
  {
    id: "1",
    title: "A Radiant Welcome!",
    content: "Dharshana, your presence brightens this digital realm,\nA beauty like yours, an enchanting, joyful psalm.\nWelcome to your journey, exquisitely grand.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG20240901122028.heic?updatedAt=1748531264380",
    imageAiHint: "elegant entrance beautiful",
    suggestedNextScreen: "2",
    cardIcon: PartyPopper,
    style: { accentColor: "hsl(330, 80%, 65%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Pink
    threeDElements: [{type: "Sparkling Entrance", description: "Gentle sparkles and floating hearts animate around the title."}]
  },
  // Screen 2 (NO IMAGE, 5-line message)
  {
    id: "2",
    title: "The Forest of Dreams",
    content: "Dharshana, your spirit dances like sunlit leaves in a gentle breeze,\nBringing warmth and life, putting all hearts at ease.\nYour inner beauty, a forest deep and vast,\nReflecting a soul whose pure enchantment will forever last.\nIn every glance, a captivating grace is cast.",
    suggestedNextScreen: "3",
    cardIcon: TreePine,
    style: { accentColor: "hsl(120, 60%, 45%)", animations: ['animate-fadeIn', 'animate-drift'] },  // Forest Green
    threeDElements: [{type: "Animated Leaves", description: "Leaves gently sway, with subtle wind lines visible."}]
  },
  // Screen 3 (NO IMAGE, 5-line message)
  {
    id: "3",
    title: "Echoes of Your Laughter",
    content: "Your laughter, Dharshana, a melody so rare and true,\nPainting the world in hues of joyful, vibrant blue.\nIt's a sound that dances, light and wonderfully free,\nA testament to the beautiful happiness you decree.\nSuch radiant joy, for all the world to see.",
    suggestedNextScreen: "4",
    cardIcon: Smile, 
    style: { accentColor: "hsl(45, 100%, 55%)", animations: ['animate-fadeIn', 'animate-pulse'] }, // Bright Yellow
    threeDElements: [{type: "Floating Joyful Particles", description: "Subtle, colorful particles and musical notes drift."}]
  },
  // Screen 4 (NO IMAGE, 5-line message)
  {
    id: "4",
    title: "Ocean of Elegance",
    content: "Like the serene ocean, Dharshana, your elegance flows deep,\nMysteries of charm and beauty, secrets you gracefully keep.\nYour poise, a calm sea, reflecting skies so bright,\nEvery gesture a wave of pure, captivating light.\nA vision of grace, a truly wondrous sight.",
    suggestedNextScreen: "5",
    cardIcon: Waves,
    style: { accentColor: "hsl(200, 70%, 60%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Ocean Blue
    threeDElements: [{type: "Gentle Wave Motion", description: "Subtle, looping wave animation on the card edges; perhaps tiny fish silhouettes."}]
  },
  // Screen 5 (NO IMAGE, 5-line message)
  {
    id: "5",
    title: "Starlight Gaze",
    content: "Dharshana, your eyes shimmer with a starlight, gentle and keen,\nA universe of dreams within them, a mesmerizing scene.\nThey tell stories of wisdom, kindness, and delightful grace,\nA captivating beauty no time can ever erase.\nEach twinkle a star in its perfect, destined place.",
    suggestedNextScreen: "6",
    cardIcon: Star,
    style: { accentColor: "hsl(260, 70%, 70%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-drift'] }, // Deep Indigo/Purple
    threeDElements: [{type: "Twinkling Stars", description: "Subtle twinkling stars and a hint of a cosmic nebula background effect."}]
  },
  // Screen 6 (WITH IMAGE, 3-line message)
  {
    id: "6",
    title: "The Creative Glow",
    content: "Your creativity shines, a vibrant, beautiful art,\nA unique spark, Dharshana, captivating every heart.\nYour ideas bloom, wonderfully bright and bold.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG_20250529_204426.jpg?updatedAt=1748531691119",
    imageAiHint: "artistic soul inspiration",
    suggestedNextScreen: "7",
    cardIcon: Lightbulb,
    style: { accentColor: "hsl(50, 90%, 60%)", animations: ['animate-fadeIn'] }, // Golden Yellow
    threeDElements: [{type: "Animated Lightbulb Glow", description: "Icon glows and emits creative particles like paint splatters."}]
  },
  // Screen 7 (NO IMAGE, 5-line message)
  {
    id: "7",
    title: "Vista of Your Soul",
    content: "Dharshana, the landscape of your soul is breathtakingly serene,\nA vista of compassion, a truly peaceful, beautiful scene.\nMountains of strength, valleys of gentle, kind thought,\nEvery contour with grace and loveliness exquisitely wrought.\nA panoramic beauty, divinely sought.",
    suggestedNextScreen: "8",
    cardIcon: Mountain, 
    style: { accentColor: "hsl(150, 50%, 55%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Teal Green
    threeDElements: [{type: "Shifting Mountain Silhouette", description: "Parallax effect with distant bird silhouettes."}]
  },
  // Screen 8 (NO IMAGE, 5-line message)
  {
    id: "8",
    title: "The Gift of Your Smile",
    content: "Your smile, Dharshana, is a precious, daily gift,\nIts warmth and sincerity give everyone an uplifting lift.\nA curve of pure joy, a beacon shining ever so free,\nUnwrapping happiness for all the world to joyfully see.\nSuch radiant beauty, a delightful decree.",
    suggestedNextScreen: "9",
    cardIcon: Gift,
    style: { accentColor: "hsl(0, 70%, 65%)", animations: ['animate-fadeIn', 'animate-pulse'] },  // Vibrant Red
    threeDElements: [{type: "Unwrapping Animation", description: "Gift opens subtly, releasing floating hearts."}]
  },
  // Screen 9 (NO IMAGE, 5-line message)
  {
    id: "9",
    title: "Key to Inner Radiance",
    content: "Dharshana, you hold the key to an inner, radiant light,\nUnlocking doors to beauty, making everything wonderfully bright.\nYour essence, a treasure, more precious than purest gold,\nA story of captivating charm, waiting to unfold.\nA luminous spirit, a marvel to behold.",
    suggestedNextScreen: "10",
    cardIcon: Key,
    style: { accentColor: "hsl(40, 85%, 65%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Warm Orange
    threeDElements: [{type: "Keyhole Reveal", description: "Keyhole animation with a soft, glowing light from within."}]
  },
  // Screen 10 (NO IMAGE, 5-line message)
  {
    id: "10",
    title: "Compass of Your Heart",
    content: "Your heart, Dharshana, a compass true and wonderfully kind,\nGuiding you towards beauty of spirit, body, and of mind.\nIt points towards empathy, towards grace, towards love's art,\nA magnetic pull towards all that sets you brilliantly apart.\nSuch exquisite navigation, a beautiful, fresh start.",
    suggestedNextScreen: "11",
    cardIcon: Compass,
    style: { accentColor: "hsl(270, 60%, 60%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Royal Purple
    threeDElements: [{type: "Spinning Compass Rose", description: "Compass spins subtly, with lines showing a world map faintly."}]
  },
  // Screen 11 (WITH IMAGE, 3-line message)
  {
    id: "11",
    title: "Feather-Light Grace",
    content: "Like a feather, Dharshana, you move with lightness and ease,\nA symbol of beauty, rustling through life's gentle trees.\nYour delicate charm, a truly captivating sight.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG-20240421-WA0156.jpg?updatedAt=1748533672549",
    imageAiHint: "graceful feather elegance",
    suggestedNextScreen: "12",
    cardIcon: Feather,
    style: { accentColor: "hsl(180, 60%, 70%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Soft Cyan
    threeDElements: [{type: "Gently Floating Feather", description: "Feather drifts slowly across the screen, with gentle wind effects."}]
  },
  // Screen 12 (NO IMAGE, 5-line message)
  {
    id: "12",
    title: "The Open Book of You",
    content: "Dharshana, your life is an open book, filled with wonder and delight,\nEach chapter revealing more of your soul's beautiful, shining light.\nPages of wisdom, paragraphs of grace and of pure art,\nA narrative of beauty that captivates every single heart.\nYour story unfolds, a truly inspiring, fresh start.",
    suggestedNextScreen: "13",
    cardIcon: BookOpen,
    style: { accentColor: "hsl(30, 60%, 55%)", animations: ['animate-fadeIn'] }, // Muted Orange/Brown
    threeDElements: [{type: "Turning Page Effect", description: "Page turns subtly, with sparkling dust emanating from the book."}]
  },
  // Screen 13 (NO IMAGE, 5-line message)
  {
    id: "13",
    title: "Your Inner Power",
    content: "Feel that spark within, Dharshana? It's your unique, dazzling might,\nA testament to strength, a beacon of pure, beautiful light.\nYour resilience, a fortress, your spirit, a vibrant, glowing fire,\nIgniting inspiration, lifting everyone ever higher.\nSuch inherent power, fulfilling every true desire.",
    suggestedNextScreen: "14",
    cardIcon: Zap,
    style: { accentColor: "hsl(60, 100%, 50%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-shimmer'] }, // Electric Yellow
    threeDElements: [{type: "Energy Aura", description: "Pulsating aura with electric sparks and elemental fire swirls."}]
  },
  // Screen 14 (NO IMAGE, 5-line message)
  {
    id: "14",
    title: "A Diamond's Sparkle",
    content: "Dharshana, within you shines a diamond, multifaceted and so rare,\nReflecting a beauty beyond all earthly, fleeting compare.\nIts facets gleam with kindness, with wisdom, and with pure delight,\nEach angle capturing and radiating your soul's brilliant light.\nA timeless elegance, a truly magnificent, precious sight.",
    suggestedNextScreen: "15",
    cardIcon: Diamond,
    style: { accentColor: "hsl(300, 70%, 70%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Bright Magenta
    threeDElements: [{type: "Sparkling Gem Effect", description: "Gem icon sparkles with refracting light, like a tiny universe inside."}]
  },
  // Screen 15 (NO IMAGE, 5-line message)
  {
    id: "15",
    title: "Enchanted Garden of Soul",
    content: "Your soul, Dharshana, is an enchanted garden, where wonders softly bloom,\nEach thought a flower, dispelling any trace of gloom.\nPetals of kindness, fragrances of grace fill the air,\nA testament to beauty cultivated with such loving care.\nA flourishing spirit, beyond all compare.",
    suggestedNextScreen: "16",
    cardIcon: Flower,
    style: { accentColor: "hsl(140, 50%, 60%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Soft Green
    threeDElements: [{type: "Blooming Flower Animation", description: "Flowers subtly bloom and vines grow, with butterflies fluttering by."}]
  },
  // Screen 16 (WITH IMAGE, 3-line message)
  {
    id: "16",
    title: "A Moment of Serenity",
    content: "In your calm, Dharshana, a peaceful beauty we find,\nA serene presence that soothes the heart and the mind.\nYour tranquility, a gift, so wonderfully profound.",
    imagePath: "https://ik.imagekit.io/n31diav73/Screenshot_2023-10-05-19-12-52-68.jpg?updatedAt=1748533798206",
    imageAiHint: "peaceful aura serene",
    suggestedNextScreen: "17",
    cardIcon: Coffee, 
    style: { accentColor: "hsl(25, 50%, 45%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Warm Brown
    threeDElements: [{type: "Steam Rising from Cup", description: "Steam animates gently, with soft water ripple effects."}]
  },
  // Screen 17 (NO IMAGE, 5-line message)
  {
    id: "17",
    title: "Floating on Cloud Nine",
    content: "Dharshana, your spirit soars, as if on Cloud Nine you gently rest,\nLight, free, and imbued with a beauty truly blessed.\nYour dreams take flight, on whispers of the gentle, warm air,\nA vision of grace, beyond all earthly, fleeting compare.\nSuch ethereal charm, a loveliness wonderfully rare.",
    suggestedNextScreen: "18",
    cardIcon: Cloud,
    style: { accentColor: "hsl(210, 100%, 85%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-drift'] }, // Light Sky Blue
    threeDElements: [{type: "Drifting Clouds", description: "Soft clouds drift, with gentle wind effects and bird silhouettes."}]
  },
  // Screen 18 (NO IMAGE, 5-line message)
  {
    id: "18",
    title: "Anchor of Your Grace",
    content: "Your grace, Dharshana, is an anchor, steady, strong, and so true,\nGrounding all around you in a beauty fresh and ever new.\nIn stormy seas of life, your poise remains a calming guide,\nA steadfast elegance where peace and loveliness reside.\nSuch beautiful composure, with nothing left to hide.",
    suggestedNextScreen: "19",
    cardIcon: Anchor,
    style: { accentColor: "hsl(220, 40%, 50%)", animations: ['animate-fadeIn'] }, // Navy Blue
    threeDElements: [{type: "Subtle Bobbing Motion", description: "Anchor icon bobs in animated water, with sea elements."}]
  },
  // Screen 19 (NO IMAGE, 5-line message)
  {
    id: "19",
    title: "Gazing with Radiant Eyes",
    content: "Through your eyes, Dharshana, the world sees kindness and pure light,\nA telescope to a soul that's wonderfully beautiful and bright.\nThey reflect a universe of empathy, so clear and so deep,\nSecrets of a gentle heart that you so beautifully keep.\nYour gaze, a star, from which true inspirations leap.",
    suggestedNextScreen: "20",
    cardIcon: Telescope,
    style: { accentColor: "hsl(250, 65%, 65%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Dark Lavender
    threeDElements: [{type: "Lens Flare Effect", description: "Subtle lens flare, revealing a glimpse of a lunar or cosmic scene."}]
  },
  // Screen 20 (NO IMAGE, 5-line message)
  {
    id: "20",
    title: "Nature's Reflection in You",
    content: "Dharshana, in you, nature's finest artistry we can clearly see,\nA tapestry of beauty, woven for eternity.\nLike a gentle leaf, your spirit, so vibrant and so green,\nNourishing all around with a grace that's perfectly serene.\nA natural elegance, the loveliest ever seen.",
    suggestedNextScreen: "21",
    cardIcon: Leaf,
    style: { accentColor: "hsl(90, 55%, 50%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Leaf Green
    threeDElements: [{type: "Evolving Natural Patterns", description: "Abstract patterns morph, suggesting growing plants and animal tracks."}]
  },
  // Screen 21 (WITH IMAGE, 3-line message)
  {
    id: "21",
    title: "Heart's Gentle Rhythm",
    content: "Your heart beats with a rhythm, Dharshana, so gentle and kind,\nA beautiful melody that soothes the soul and the mind.\nIts compass guides towards all that is lovely and true.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG-20221005-WA0004.jpg?updatedAt=1748533875321",
    imageAiHint: "loving heart kindness",
    suggestedNextScreen: "22",
    cardIcon: Heart,
    style: { accentColor: "hsl(350, 75%, 60%)", animations: ['animate-fadeIn', 'animate-pulse'] }, // Rose Red
    threeDElements: [{type: "Pulsating Heart Icon", description: "Heart icon pulses, emitting soft, floating heart particles."}]
  },
  // Screen 22 (NO IMAGE, 5-line message)
  {
    id: "22",
    title: "Snapshot of Your Joy",
    content: "Dharshana, your joy is a snapshot, perfectly framed and so clear,\nCapturing moments of beauty, banishing every single fear.\nThe lens of your spirit focuses on all that's good and bright,\nAperture wide open to life's most wonderful, pure light.\nA picture of happiness, a truly captivating, lovely sight.",
    suggestedNextScreen: "23",
    cardIcon: Aperture, 
    style: { accentColor: "hsl(190, 70%, 55%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Bright Teal
    threeDElements: [{type: "Camera Flash Effect", description: "Quick flash animation, with rain-like light streaks."}]
  },
  // Screen 23 (NO IMAGE, 5-line message)
  {
    id: "23",
    title: "The Power of Your Smile",
    content: "Dharshana, your smile holds an undeniable, beautiful power,\nBrightening the darkest day, like a fragrant, blooming flower.\nIt radiates warmth, a genuine and truly lovely art,\nA simple gesture of kindness that touches every single heart.\nA beacon of joy, right from the very start.",
    suggestedNextScreen: "24",
    cardIcon: Smile,
    style: { accentColor: "hsl(40, 90%, 60%)", animations: ['animate-fadeIn', 'animate-bounce-slow', 'animate-drift'] }, // Sunny Orange
    threeDElements: [{type: "Animated Smile Icon", description: "Smile icon animates, surrounded by sun rays and floating flower petals."}]
  },
  // Screen 24 (NO IMAGE, 5-line message)
  {
    id: "24",
    title: "Whispers of Your Wisdom",
    content: "Like the wind, Dharshana, your wisdom whispers, soft and low,\nGuiding thoughts towards insights where beautiful truths can grow.\nCarrying messages of peace, on breezes gentle and so very keen,\nA refreshing spirit, the loveliest ever to be seen.\nYour understanding flows, a current powerfully serene.",
    suggestedNextScreen: "25",
    cardIcon: Wind,
    style: { accentColor: "hsl(180, 30%, 80%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Pale Cyan/Grey
    threeDElements: [{type: "Flowing Wind Streaks", description: "Abstract wind streaks flow, with feather and leaf particles."}]
  },
  // Screen 25 (NO IMAGE, 5-line message)
  {
    id: "25",
    title: "Island of Your Dreams",
    content: "Dharshana, your mind is an island where beautiful dreams take their flight,\nSailing on oceans of hope, towards a future shining and bright.\nShores of serenity, landscapes of creativity unfold,\nA sanctuary of beauty, more precious than stories ever told.\nA realm of pure wonder, courageous, lovely, and bold.",
    suggestedNextScreen: "26",
    cardIcon: Sailboat, 
    style: { accentColor: "hsl(35, 70%, 50%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Sandy Orange
    threeDElements: [{type: "Gentle Water Ripples", description: "Water ripples subtly, with a world map overlay and birds flying above."}]
  },
  // Screen 26 (WITH IMAGE, 3-line message)
  {
    id: "26",
    title: "Journey to the Stars",
    content: "Like a star, Dharshana, your brilliance knows no earthly bound,\nIn your unique galaxy, true beauty can always be found.\nYour spirit launches towards dreams, ever so high.",
    imagePath: "https://ik.imagekit.io/n31diav73/Snapchat-788628718.jpg?updatedAt=1748534034702",
    imageAiHint: "star bright beautiful",
    suggestedNextScreen: "27",
    cardIcon: Rocket,
    style: { accentColor: "hsl(230, 70%, 60%)", animations: ['animate-fadeIn'] }, // Space Blue
    threeDElements: [{type: "Rocket Trail Animation", description: "Trail animates, moving through a universe starfield with lunar elements."}]
  },
  // Screen 27 (NO IMAGE, 5-line message)
  {
    id: "27",
    title: "Around Your World of Grace",
    content: "Dharshana, your grace creates a world, uniquely its own,\nWhere kindness blossoms and seeds of beauty are lovingly sown.\nContinents of charm, oceans of elegance you embrace,\nA globe of pure loveliness, a truly captivating, wondrous space.\nYour aura extends, a beautiful, warm, and inviting place.",
    suggestedNextScreen: "28",
    cardIcon: Globe,
    style: { accentColor: "hsl(150, 60%, 50%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Earthy Green/Blue
    threeDElements: [{type: "Spinning Globe Icon", description: "Globe icon spins, showing continents and oceans, with animal silhouettes."}]
  },
  // Screen 28 (NO IMAGE, 5-line message)
  {
    id: "28",
    title: "Crowning Glory of You",
    content: "Dharshana, your spirit wears a crown of virtues, unseen yet so real,\nA testament to the noble beauty your actions gently reveal.\nJewels of integrity, a band of kindness, strong and so true,\nA regal elegance in everything you say and you beautifully do.\nYour inner royalty shines, for all the world to view.",
    suggestedNextScreen: "29",
    cardIcon: Crown,
    style: { accentColor: "hsl(50, 100%, 50%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-shimmer'] }, // Gold
    threeDElements: [{type: "Sparkling Crown", description: "Crown icon sparkles with light rays and floating gem-like particles."}]
  },
  // Screen 29 (NO IMAGE, 5-line message)
  {
    id: "29",
    title: "A Touch of Your Magic",
    content: "Dharshana, there's a magic in your presence, a captivating, gentle art,\nTransforming ordinary moments, enchanting every single heart.\nA sprinkle of wonder, a gleam of pure, beautiful delight,\nYour aura weaves enchantment, making everything perfectly bright.\nYou carry a charm, a truly spellbinding, lovely light.",
    suggestedNextScreen: "30",
    cardIcon: Wand2,
    style: { accentColor: "hsl(280, 80%, 70%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Mystical Purple
    threeDElements: [{type: "Sparkle Trail Effect", description: "Sparkle trail animates, with abstract elemental swirls (air, water)."}]
  },
  // Screen 30 (NO IMAGE, 5-line message)
  {
    id: "30",
    title: "Artist of Your Life",
    content: "Dharshana, you are the artist, painting your life with hues so grand,\nA masterpiece of beauty, crafted by your own gentle hand.\nStrokes of compassion, a palette of colors, vibrant and so free,\nCreating a canvas of wonder for all the world to joyfully see.\nYour life, a portrait of captivating, true artistry.",
    suggestedNextScreen: "31",
    cardIcon: Palette,
    style: { accentColor: "hsl(20, 80%, 60%)", animations: ['animate-fadeIn'] }, // Coral/Orange
    threeDElements: [{type: "Color Swirl Animation", description: "Colors swirl subtly, like rain mixing on a palette."}]
  },
   // Screen 31 (WITH IMAGE, 3-line message)
  {
    id: "31",
    title: "Blueprint of Brilliance",
    content: "Dharshana, your mind designs a blueprint, so brilliant and rare,\nA framework of beauty, beyond all earthly compare.\nYour thoughts construct wonders, with precision and with grace.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG_20250529_212705.jpg?updatedAt=1748534276129",
    imageAiHint: "intelligent mind beautiful",
    suggestedNextScreen: "32",
    cardIcon: PenTool, 
    style: { accentColor: "hsl(210, 50%, 50%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Steel Blue
    threeDElements: [{type: "Drawing Line Animation", description: "Lines animate into geometric shapes, like a world map being drawn."}]
  },
  // Screen 32 (NO IMAGE, 5-line message)
  {
    id: "32",
    title: "The Editor of Moments",
    content: "Dharshana, you curate moments with an editor's discerning, keen eye,\nHighlighting the beauty in each day as it swiftly passes by.\nRefining experiences, adding chapters of joy, so clear and so bold,\nCrafting a narrative of loveliness, a story to be wonderfully told.\nYour perspective shapes a life more precious than pure gold.",
    suggestedNextScreen: "33",
    cardIcon: Edit3, 
    style: { accentColor: "hsl(0, 0%, 60%)", animations: ['animate-fadeIn'] }, // Neutral Grey
    threeDElements: [{type: "Focus Effect", description: "Visual focus on text, with water droplet ripples expanding outwards."}]
  },
  // Screen 33 (NO IMAGE, 5-line message)
  {
    id: "33",
    title: "Windows to Your Soul",
    content: "Your eyes, Dharshana, are windows to a soul so pure and truly bright,\nReflecting a world of kindness, bathed in a soft, beautiful light.\nThey gaze with compassion, with understanding, gentle and so deep,\nSecrets of an empathetic heart that they so beautifully keep.\nThrough them, your lovely spirit takes a magnificent leap.",
    suggestedNextScreen: "34",
    cardIcon: Eye,
    style: { accentColor: "hsl(180, 70%, 40%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-shimmer'] }, // Deep Cyan
    threeDElements: [{type: "Gentle Blink Animation", description: "Eye icon blinks, revealing a brief universe/starfield in the iris."}]
  },
  // Screen 34 (NO IMAGE, 5-line message)
  {
    id: "34",
    title: "Life's Grand Stage Star",
    content: "Dharshana, on life's grand stage, you are the undeniable, shining star,\nYour performance of grace and beauty resonates near and truly far.\nEach act, a display of talent, of kindness, and of pure delight,\nCaptivating the audience with your soul's incredibly beautiful light.\nYou play your part with passion, a truly magnificent, lovely sight.",
    suggestedNextScreen: "35",
    cardIcon: VenetianMask, // Replaced Drama
    style: { accentColor: "hsl(340, 70%, 50%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Deep Pink/Rose
    threeDElements: [{type: "Opening Stage Curtains", description: "Curtains reveal content, with floating hearts and musical notes."}]
  },
  // Screen 35 (NO IMAGE, 5-line message)
  {
    id: "35",
    title: "Cinematic Charm",
    content: "Dharshana, your life unfolds with moments of cinematic, pure charm,\nEach scene a testament to a spirit that keeps you safe from harm.\nClose-ups of your smile, wide shots of your generous, kind heart,\nA beautiful motion picture, a true and magnificent work of art.\nYour story, a classic, right from the very start.",
    suggestedNextScreen: "36",
    cardIcon: Film,
    style: { accentColor: "hsl(0, 0%, 40%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Dark Grey / Silver
    threeDElements: [{type: "Film Reel Animation", description: "Film reels spin, with subtle rain streaks on the 'lens'."}]
  },
  // Screen 36 (WITH IMAGE, 3-line message)
  {
    id: "36",
    title: "The Seeker's Quest",
    content: "In your quest for life's beauty, Dharshana, you find it all around,\nYour perceptive spirit uncovers wonders on hallowed ground.\nA seeker of joy, a finder of grace, so wonderfully true.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG_20250529_204426.jpg?updatedAt=1748531691119",
    imageAiHint: "beautiful discovery journey",
    suggestedNextScreen: "37",
    cardIcon: Search,
    style: { accentColor: "hsl(40, 60%, 40%)", animations: ['animate-fadeIn'] }, // Earthy Brown
    threeDElements: [{type: "Pulsing Search Icon", description: "Search icon pulses, revealing faint animal paw prints."}]
  },
  // Screen 37 (NO IMAGE, 5-line message)
  {
    id: "37",
    title: "Your Inner Sanctum",
    content: "Dharshana, your inner sanctum is a place of peace and beauty rare,\nA shielded haven where only the purest thoughts would ever dare.\nWalls of resilience, gardens of serenity, calm and so deep,\nWithin this sacred space, your lovely spirit you carefully keep.\nA tranquil retreat where your truest strengths gently sleep.",
    suggestedNextScreen: "38",
    cardIcon: Shield, 
    style: { accentColor: "hsl(220, 60%, 75%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Soft Blue/Silver
    threeDElements: [{type: "Glowing Aura of Peace", description: "Soft glow emanates, with natural elemental symbols (earth, water) faintly appearing."}]
  },
  // Screen 38 (NO IMAGE, 5-line message)
  {
    id: "38",
    title: "The Unseen Friend Within",
    content: "Dharshana, an unseen friend, your intuition, guides with gentle might,\nWhispering truths of your beauty, leading you towards pure, shining light.\nIts supportive presence, a comfort, so steady and so true,\nAffirming the wonderful, captivating essence that is uniquely you.\nThis inner companion celebrates all you say and beautifully do.",
    suggestedNextScreen: "39",
    cardIcon: User, 
    style: { accentColor: "hsl(270, 50%, 80%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-drift'] }, // Light Purple
    threeDElements: [{type: "Gentle Light Beams", description: "Soft light beams with lunar glow and wind-swept particles."}]
  },
  // Screen 39 (NO IMAGE, 5-line message)
  {
    id: "39",
    title: "Message of Your Beauty",
    content: "Dharshana, if your beauty sent a message, it would travel far and wide,\nA proclamation of elegance, with nothing at all to ever hide.\nSealed with sincerity, carried on waves of admiration's gentle tide,\nIt would speak of a spirit where grace and loveliness always reside.\nYour charm, a dispatch, in which all hearts can joyfully confide.",
    suggestedNextScreen: "40",
    cardIcon: Mail,
    style: { accentColor: "hsl(195, 60%, 55%)", animations: ['animate-fadeIn'] }, // Sky Blue
    threeDElements: [{type: "Floating Message Bottle", description: "Message in a bottle bobs on animated water, with bird silhouettes."}]
  },
  // Screen 40 (NO IMAGE, 5-line message)
  {
    id: "40",
    title: "Powering Connections with Grace",
    content: "Dharshana, you power connections with a grace that's beautifully strong,\nWeaving a network of kindness where all spirits can truly belong.\nYour empathetic energy, a current, vibrant and so wonderfully bright,\nLinking hearts together with your soul's captivating, pure light.\nYour presence, a conduit for all that's good and wonderfully right.",
    suggestedNextScreen: "41",
    cardIcon: Zap, 
    style: { accentColor: "hsl(170, 80%, 40%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Vibrant Sea Green
    threeDElements: [{type: "Pulsing Light Traces", description: "Light traces pulse, connecting floating heart icons."}]
  },
   // Screen 41 (WITH IMAGE, 3-line message)
  {
    id: "41",
    title: "The Unfolding Path of Charm",
    content: "Your path, Dharshana, unfolds with charm at every single turn,\nA journey of beauty where lessons of grace you gracefully learn.\nEach step forward, a testament to your captivating style.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG_20250529_212705.jpg?updatedAt=1748534276129",
    imageAiHint: "charming path beautiful",
    suggestedNextScreen: "42",
    cardIcon: Compass,
    style: { accentColor: "hsl(100, 50%, 50%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Bright Lime Green
    threeDElements: [{type: "Footprints Appearing", description: "Footprints animate along a path, with natural elements like leaves and flowers."}]
  },
  // Screen 42 (NO IMAGE, 5-line message)
  {
    id: "42",
    title: "Symphony of Your Colors",
    content: "Dharshana, your essence is a symphony, with colors rich and so grand,\nA vibrant composition, orchestrated by your own gentle hand.\nNotes of kindness, harmonies of grace, in a beautiful, flowing stream,\nEach shade a reflection of your soul's captivating, lovely dream.\nYour spirit's music, a truly magnificent, melodic theme.",
    suggestedNextScreen: "43",
    cardIcon: Palette, 
    style: { accentColor: "hsl(280, 60%, 70%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Soft Violet
    threeDElements: [{type: "Abstract Color Waves", description: "Flowing color waves, like an aurora borealis or rain through a rainbow."}]
  },
  // Screen 43 (NO IMAGE, 5-line message)
  {
    id: "43",
    title: "The Alchemist of Joy",
    content: "Dharshana, you are an alchemist, turning moments to purest, shining gold,\nTransforming the everyday with a beauty, wonderful to behold.\nYour touch, a Midas charm, making ordinary things so divine,\nA magical ability to make true happiness beautifully shine.\nYour spirit's alchemy, a captivating and precious design.",
    suggestedNextScreen: "44",
    cardIcon: Wand2, 
    style: { accentColor: "hsl(40, 100%, 50%)", animations: ['animate-fadeIn', 'animate-pulse'] }, // Rich Gold/Yellow
    threeDElements: [{type: "Sparkling Transformation Effect", description: "Particles transform with cosmic and elemental (fire, water) sparks."}]
  },
  // Screen 44 (NO IMAGE, 5-line message)
  {
    id: "44",
    title: "Storyteller of Your Radiance",
    content: "Dharshana, by the fire of your spirit, stories of radiance you gently tell,\nCaptivating all who listen with a beauty that casts a lovely spell.\nNarratives of kindness, sagas of grace, spoken with a voice so clear,\nDrawing everyone closer, banishing every single doubt and fear.\nYour life's tale, a legend, held wonderfully precious and dear.",
    suggestedNextScreen: "45",
    cardIcon: BookOpen, 
    style: { accentColor: "hsl(20, 70%, 50%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Burnt Orange
    threeDElements: [{type: "Flickering Fire Animation", description: "Subtle fire flicker with wind-blown embers and animal silhouettes in the smoke."}]
  },
  // Screen 45 (NO IMAGE, 5-line message)
  {
    id: "45",
    title: "Ancient Wisdom, Modern Grace",
    content: "Dharshana, you embody ancient wisdom with a truly modern, beautiful grace,\nA timeless elegance that time itself cannot ever erase.\nSymbols of insight, etched in the kindness of your lovely heart,\nA profound understanding that sets your beautiful spirit apart.\nYour soul, a library of life's most precious, noble art.",
    suggestedNextScreen: "46",
    cardIcon: Brain, 
    style: { accentColor: "hsl(30, 40%, 30%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Deep Brown
    threeDElements: [{type: "Glowing Symbols Effect", description: "Ancient symbols glow, with a backdrop of a lunar cycle or world map."}]
  },
  // Screen 46 (WITH IMAGE, 3-line message)
  {
    id: "46",
    title: "The Weaver of Dreams",
    content: "With threads of hope, Dharshana, you weave dreams so wonderfully bright,\nA tapestry of beauty, shimmering in day and in the night.\nYour skillful hands craft futures, so lovely and so grand.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG-20240421-WA0156.jpg?updatedAt=1748533672549",
    imageAiHint: "dream weaver beautiful",
    suggestedNextScreen: "47",
    cardIcon: Edit3, 
    style: { accentColor: "hsl(320, 60%, 60%)", animations: ['animate-fadeIn', 'animate-shimmer'] }, // Orchid Pink
    threeDElements: [{type: "Weaving Thread Animation", description: "Threads animate, weaving star patterns and natural elements like flowers."}]
  },
  // Screen 47 (NO IMAGE, 5-line message)
  {
    id: "47",
    title: "The Lighthouse of Your Spirit",
    content: "Dharshana, your spirit is a lighthouse, its beam so steady and so clear,\nGuiding others with your beauty, calming every single rising fear.\nIts radiant glow, a beacon of hope in the darkest of the night,\nA symbol of resilience, a truly captivating, lovely light.\nShining with kindness, making the whole world wonderfully bright.",
    suggestedNextScreen: "48",
    cardIcon: Lightbulb,
    style: { accentColor: "hsl(50, 90%, 55%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-shimmer'] }, // Bright Yellow
    threeDElements: [{type: "Rotating Light Beam", description: "Light beam animates from the lighthouse, with rain and sea spray effects."}]
  },
  // Screen 48 (NO IMAGE, 5-line message)
  {
    id: "48",
    title: "Gardener of Your Graces",
    content: "Dharshana, you are a gardener, tending to graces with such loving care,\nNurturing seeds of beauty that blossom everywhere.\nYour gentle hand cultivates kindness, a flourishing, vibrant art,\nIn the fertile soil of your generous and truly lovely heart.\nYour life's garden, a masterpiece, right from the very start.",
    suggestedNextScreen: "49",
    cardIcon: Sprout, // Replaced Leaf for variety
    style: { accentColor: "hsl(120, 50%, 45%)", animations: ['animate-fadeIn', 'animate-drift'] }, // Vibrant Green
    threeDElements: [{type: "Growing Sprout Animation", description: "Sprout animates growing, with water droplets and visiting bird/insect animations."}]
  },
  // Screen 49 (NO IMAGE, 5-line message)
  {
    id: "49",
    title: "The Final Doorway's Glow",
    content: "Before this journey's final doorway, Dharshana, your beauty brightly glows,\nA culmination of all the wonderful grace your spirit truly knows.\nIt shimmers with insights, with laughter, with moments held so dear,\nA radiant aura of loveliness, banishing any lingering fear.\nStep through with pride, your captivating essence perfectly clear.",
    suggestedNextScreen: "50",
    cardIcon: Key,
    style: { accentColor: "hsl(279, 100%, 60%)", animations: ['animate-fadeIn', 'animate-pulse', 'animate-shimmer'] }, // Brightest Primary Violet
    threeDElements: [{type: "Door Opening Slightly", description: "Doorway animates opening, revealing a universe/cosmos beyond."}]
  },
  // Screen 50 (NO IMAGE, 5-line message - Grand Finale)
  {
    id: "50",
    title: "Your Everlasting Tapestry",
    content: "Dharshana, this digital chapter closes, but your beauty's tapestry expands,\nWoven with threads of brilliance by your own magnificent hands.\nEach strand a testament to your captivating, endless grace,\nA timeless masterpiece of loveliness, no time can ever erase.\nYour radiant journey continues, illuminating every single place.",
    imagePath: "https://ik.imagekit.io/n31diav73/IMG20240901122028.heic?updatedAt=1748531264380",
    suggestedNextScreen: (MAX_SCREENS + 1).toString(), 
    cardIcon: Award,
    style: { accentColor: "hsl(279, 100%, 75%)", animations: ['animate-fadeIn', 'animate-bounce-slow'] }, // Brighter Accent Violet
    threeDElements: [{type: "Celebratory Confetti Burst", description: "Confetti animates with floating hearts, stars, and all natural elements in a joyful mix."}]
  },
];


export default function InteractiveScreenClient({ currentScreenIdProp }: { currentScreenIdProp: string }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentScreenId, setCurrentScreenId] = useState<string>(currentScreenIdProp);
  const [currentScreenDetails, setCurrentScreenDetails] = useState<ScreenDefinition | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentScreenId(currentScreenIdProp);
    setIsLoading(true); 
    setError(null);
    setIsNavigating(false); 
  }, [currentScreenIdProp]);
  
  useEffect(() => {
    if (!currentScreenId) return;

    setIsLoading(true); 
    const numericScreenId = parseInt(currentScreenId, 10);
    if (numericScreenId > MAX_SCREENS) {
      setIsLoading(false); 
      return; 
    }

    const screenDefinition = allScreens.find(s => s.id === currentScreenId);

    if (screenDefinition) {
      setCurrentScreenDetails(screenDefinition);
      if (cardRef.current && screenDefinition.style?.animations) {
        // Remove previous animation classes before adding new ones
        const currentAnimations = cardRef.current.className.match(/\banimate-\S+\b/g) || [];
        currentAnimations.forEach(animClass => cardRef.current?.classList.remove(animClass));
        
        // Add new animation classes
        screenDefinition.style.animations.forEach(animClass => {
          cardRef.current?.classList.add(animClass);
        });
      }
    } else {
      console.error(`Screen definition not found for ID: ${currentScreenId}`);
      setError(`Oops! Screen ${currentScreenId} seems to be missing. Let's guide you back.`);
    }
    setIsLoading(false);
  }, [currentScreenId]);

  const handleNavigation = (event?: FormEvent) => { 
    event?.preventDefault();
    if (isNavigating) return; 
    setIsNavigating(true);

    toast({
        title: "Journeying Onward!",
        description: "The next chapter awaits...",
        variant: "default",
        duration: 1500,
    });
    
    let nextScreenId: string | undefined = undefined;
    if (currentScreenDetails?.suggestedNextScreen) {
      nextScreenId = currentScreenDetails.suggestedNextScreen;
    } else {
      const numericCurrentId = parseInt(currentScreenId, 10);
      if (!isNaN(numericCurrentId) && numericCurrentId < MAX_SCREENS) {
        nextScreenId = (numericCurrentId + 1).toString();
      } else {
        nextScreenId = (MAX_SCREENS + 1).toString(); 
      }
    }
    
    if (nextScreenId) {
      setLocalStorageItem('currentScreenId', nextScreenId);
      router.push(`/screens/${nextScreenId}`);
    }
  };

  const restartJourney = () => {
    setLocalStorageItem('currentScreenId', '1'); 
    router.push('/screens/1');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-xl text-foreground/80">Crafting your next wondrous step...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Card className="max-w-lg w-full bg-card/80 backdrop-blur-sm shadow-xl border-destructive/50">
          <CardHeader>
             <div className="mx-auto mb-4 p-3 bg-destructive/20 rounded-full w-fit">
                <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">A Detour on the Path!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive-foreground mb-6">{error}</p>
            <Button onClick={restartJourney} variant="destructive" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Restart Journey from Beginning
            </Button>
             <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" /> Return to Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const numericCurrentScreenId = parseInt(currentScreenId, 10);
  if (numericCurrentScreenId > MAX_SCREENS) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center animate-fadeIn">
        <PartyPopper className="h-24 w-24 text-primary mb-8 animate-bounce-slow" />
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
          Your Odyssey is Celebrated!
        </h1>
        <p className="text-2xl text-foreground/90 mb-10 max-w-2xl">
          Congratulations, Dharshana! You've navigated this expansive digital adventure. May the echoes of this journey inspire you always!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={restartJourney} size="lg" variant="outline" className="transform hover:scale-105 active:scale-95 transition-transform">
            <RotateCcw className="mr-2 h-5 w-5" /> Replay This Grand Journey
          </Button>
          <Button onClick={() => router.push('/')} size="lg" className="transform hover:scale-105 active:scale-95 transition-transform">
            <Home className="mr-2 h-5 w-5" /> Back to the Portal
          </Button>
        </div>
      </div>
    );
  }

  if (!currentScreenDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-foreground/80">Summoning the next screen...</p>
         <Button onClick={restartJourney} variant="outline" className="mt-6">
            <RotateCcw className="mr-2 h-4 w-4" /> Start Over
        </Button>
      </div>
    );
  }

  const customStyle = currentScreenDetails.style || {};
  const dynamicCardStyle: CSSProperties = {
    backgroundColor: customStyle.backgroundColor || undefined, // Kept for potential future direct bg override
    color: customStyle.textColor || undefined,
    fontSize: customStyle.fontSize || undefined,
    fontFamily: customStyle.fontFamily || undefined,
  };
  const initialAnimations = (currentScreenDetails.style?.animations?.join(' ') || 'animate-fadeIn');

  const CardIcon = currentScreenDetails.cardIcon;

  return (
    <Card 
      ref={cardRef}
      className={`w-full max-w-3xl m-4 shadow-2xl border-border/30 bg-card/85 backdrop-blur-xl ${initialAnimations}`} 
      style={{
        ...dynamicCardStyle, 
        '--card-accent-glow': customStyle.accentColor || 'hsl(var(--primary))', // Define CSS variable for glow
        borderColor: customStyle.accentColor || 'hsl(var(--border))',
        boxShadow: `0 0 25px -5px var(--card-accent-glow), 0 0 15px -8px var(--card-accent-glow)` // Enhanced glow
      }}
    >
      <CardHeader className="text-center pb-4">
        {CardIcon && (
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit border border-primary/30 shadow-inner">
            <CardIcon className="w-10 h-10" style={{color: customStyle.accentColor || 'hsl(var(--primary))'}} />
          </div>
        )}
        <p className="text-sm" style={{color: customStyle.accentColor || 'hsl(var(--muted-foreground))'}}>Chapter {currentScreenId} / {MAX_SCREENS}</p>
        <CardTitle className="text-4xl font-extrabold tracking-tight leading-tight" style={{ color: customStyle.accentColor || customStyle.textColor || 'hsl(var(--foreground))' }}>
            {currentScreenDetails.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-lg leading-relaxed pb-6" style={{color: dynamicCardStyle.color, fontSize: dynamicCardStyle.fontSize, fontFamily: dynamicCardStyle.fontFamily}}>
        
        {currentScreenDetails.imagePath && (
          <div className="my-6 rounded-lg overflow-hidden shadow-xl aspect-video relative border-2" style={{borderColor: customStyle.accentColor || 'hsl(var(--primary)/0.3)'}}>
            <Image 
              src={currentScreenDetails.imagePath} 
              alt={currentScreenDetails.imageAiHint || currentScreenDetails.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={currentScreenDetails.imageAiHint || currentScreenDetails.title.substring(0,50)}
              priority={parseInt(currentScreenId) <= 2} // Prioritize loading for early screens
              className="transform hover:scale-105 transition-transform duration-300 ease-out"
            />
          </div>
        )}

        <div className="whitespace-pre-wrap p-6 bg-background/50 rounded-md shadow-inner text-center text-foreground/90 text-xl">
          {currentScreenDetails.content}
        </div>
        
        {/* threeDElements display box and user input form are removed */}

        <Button 
            onClick={handleNavigation} 
            className="w-full h-12 text-md font-semibold group transform hover:scale-105 active:scale-95 transition-all duration-200 mt-8" 
            disabled={isNavigating || isLoading}
            style={{backgroundColor: customStyle.accentColor || 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))'}}
        >
          {isNavigating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
              Continue to Next Chapter <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-center pt-4">
        Dharshana's Digital Journey &copy; {new Date().getFullYear()}
      </CardFooter>
    </Card>
  );
}
