const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = path.join(__dirname, 'seo-template.html');
const SITEMAP_FILE = path.join(__dirname, 'sitemap.xml');
const SITEMAPS_DIR = path.join(__dirname, 'sitemaps');

// Extract all internal links from the sitemaps folder
let allInternalLinks = [];

function extractLinksFromSitemaps() {
  if (!fs.existsSync(SITEMAPS_DIR)) return;
  const files = fs.readdirSync(SITEMAPS_DIR).filter(file => file.endsWith('.xml'));
  
  files.forEach(file => {
    const filePath = path.join(SITEMAPS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract everything between <loc> and </loc>
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1].includes('examspark.in')) {
        allInternalLinks.push(match[1]);
      }
    }
  });
  
  // Remove duplicates
  allInternalLinks = [...new Set(allInternalLinks)];
  console.log(`Extracted ${allInternalLinks.length} unique internal links from sitemaps.`);
}

extractLinksFromSitemaps();

// Helper to create a human-readable title from a URL
function formatLinkTitle(url) {
  // e.g., https://examspark.in/class10-science-ch1 -> class10 science ch1
  let slug = url.split('/').pop();
  if (!slug) return 'ExamSpark';
  
  // Remove .html if present
  slug = slug.replace('.html', '');
  
  // Convert hyphens to spaces and title case
  let words = slug.split('-');
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Function to get N random internal links formatted as HTML <li> elements
function getRandomInternalLinksHTML(count = 10) {
  if (allInternalLinks.length === 0) return '';
  
  // Shuffle array and pick 'count' items
  const shuffled = [...allInternalLinks].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  return selected.map(url => `<li><a href="${url}" title="${formatLinkTitle(url)}">${formatLinkTitle(url)}</a></li>`).join('\n      ');
}


// Variations for permutations
const standardClasses = [6, 7, 8, 9, 10];
const standardSubjects = ['Science', 'Maths', 'English', 'Social Science'];

const seniorClasses = [11, 12];
const seniorSubjects = ['Physics', 'Chemistry', 'Maths', 'Biology', 'English'];

const competitiveExams = [
  { exam: 'NEET', subjects: ['Physics', 'Chemistry', 'Biology'] },
  { exam: 'JEE', subjects: ['Physics', 'Chemistry', 'Maths'] },
  { exam: 'CUET', subjects: ['General Test', 'Physics', 'Chemistry', 'Maths', 'Biology', 'English', 'History', 'Geography', 'Political Science'] }
];

const questionTypes = [
  { type: 'MCQ', suffix: 'mcq-questions', titlePart: 'MCQ Question Generator', shortTitle: 'MCQ Generator' },
  { type: 'Assertion Reason', suffix: 'assertion-reason-questions', titlePart: 'Assertion Reason Questions', shortTitle: 'Assertion Reason Generator' },
  { type: 'Case Study', suffix: 'case-study-questions', titlePart: 'Case Study Questions', shortTitle: 'Case Study Generator' },
  { type: 'Important Questions', suffix: 'important-questions', titlePart: 'Important Questions Generator', shortTitle: 'Important Qs Generator' },
  { type: 'General', suffix: 'question-generator', titlePart: 'Question Generator', shortTitle: 'Question Generator' }
];

let pagesToGenerate = [];

// Helper to push standard/senior class pages
function addClassPages(classes, subjects) {
  classes.forEach(cls => {
    subjects.forEach(subject => {
      questionTypes.forEach(qType => {
        let slug = `class-${cls}-${subject.toLowerCase().replace(/ /g, '-')}-${qType.suffix}`;
        let titleName = `Class ${cls} ${subject}`;
        
        pagesToGenerate.push({
          slug,
          title: `${titleName} ${qType.titlePart} | Free MCQs & Notes | QSpark AI`,
          description: `Generate ${titleName} ${qType.type} questions instantly. Free AI-powered tool for exam preparation.`,
          keywords: `class ${cls} ${subject.toLowerCase()} questions, ${subject.toLowerCase()} ${qType.type.toLowerCase()} class ${cls}, online question maker`,
          h1: `${titleName} ${qType.titlePart}`,
          subtitle: `Free AI Tool for ${titleName} Students ⚡`,
          section1Heading: `Generate ${titleName} ${qType.type} Questions Instantly`,
          section1Text: `Preparing for ${titleName} exams can be challenging. Our powerful AI-based question generator helps students create unlimited ${qType.type} questions in seconds.`,
          classParam: `Class ${cls}`,
          subjectParam: subject,
          shortTitle: qType.shortTitle,
          topicName: titleName
        });
      });
    });
  });
}

// Add pages
addClassPages(standardClasses, standardSubjects);
addClassPages(seniorClasses, seniorSubjects);

// Add competitive exams
competitiveExams.forEach(examObj => {
  examObj.subjects.forEach(subject => {
    questionTypes.forEach(qType => {
      let slug = `${examObj.exam.toLowerCase()}-${subject.toLowerCase().replace(/ /g, '-')}-${qType.suffix}`;
      let titleName = `${examObj.exam} ${subject}`;
      
      pagesToGenerate.push({
        slug,
        title: `${titleName} ${qType.titlePart} | QSpark AI`,
        description: `Generate ${titleName} ${qType.type} questions instantly. Boost your ${examObj.exam} preparation with our free AI tool.`,
        keywords: `${examObj.exam.toLowerCase()} ${subject.toLowerCase()} questions, ${examObj.exam.toLowerCase()} mock test, online question maker`,
        h1: `${titleName} ${qType.titlePart}`,
        subtitle: `Free AI Tool for ${examObj.exam} Aspirants ⚡`,
        section1Heading: `Generate ${titleName} ${qType.type} Questions Instantly`,
        section1Text: `Cracking ${examObj.exam} requires rigorous practice. Our AI tool provides unlimited ${titleName} ${qType.type} questions to test your knowledge.`,
        classParam: examObj.exam,
        subjectParam: subject,
        shortTitle: qType.shortTitle,
        topicName: titleName
      });
    });
  });
});

console.log(`Prepared ${pagesToGenerate.length} pages to generate.`);

// Write seo-data.json for record-keeping
fs.writeFileSync(path.join(__dirname, 'seo-data.json'), JSON.stringify(pagesToGenerate, null, 2));

// Read template
const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

// Sitemaps URLs
let newSitemapUrls = [];

pagesToGenerate.forEach(page => {
  let content = template;
  content = content.replace(/{{TITLE}}/g, page.title);
  content = content.replace(/{{DESCRIPTION}}/g, page.description);
  content = content.replace(/{{SLUG}}/g, page.slug);
  content = content.replace(/{{KEYWORDS}}/g, page.keywords);
  content = content.replace(/{{H1}}/g, page.h1);
  content = content.replace(/{{SUBTITLE}}/g, page.subtitle);
  content = content.replace(/{{SECTION_1_HEADING}}/g, page.section1Heading);
  content = content.replace(/{{SECTION_1_TEXT}}/g, page.section1Text);
  content = content.replace(/{{CLASS_PARAM}}/g, encodeURIComponent(page.classParam));
  content = content.replace(/{{SUBJECT_PARAM}}/g, encodeURIComponent(page.subjectParam));
  content = content.replace(/{{SHORT_TITLE}}/g, page.shortTitle);
  content = content.replace(/{{TOPIC_NAME}}/g, page.topicName);
  
  // Inject random internal links for SEO link juice
  const internalLinksHTML = getRandomInternalLinksHTML(12); // Pick 12 random links per page
  content = content.replace(/{{INTERNAL_LINKS}}/g, internalLinksHTML);

  fs.writeFileSync(path.join(__dirname, `${page.slug}.html`), content);
  
  newSitemapUrls.push(`
  <url>
    <loc>https://qspark-ai.examspark.in/${page.slug}.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

// Update Sitemap
if (fs.existsSync(SITEMAP_FILE)) {
  let sitemapContent = fs.readFileSync(SITEMAP_FILE, 'utf-8');
  // First, we should check if the new links are already in the sitemap to avoid duplicates.
  // A simple way is to just overwrite the <urlset> ending if we are confident, 
  // but to prevent multiple runs from exploding the file size:
  // Let's strip out any URLs we've previously generated so we don't duplicate them in sitemap.xml
  pagesToGenerate.forEach(page => {
      const pageLoc = `https://qspark-ai.examspark.in/${page.slug}.html`;
      const regex = new RegExp(`\\s*<url>\\s*<loc>${pageLoc}</loc>[\\s\\S]*?</url>`, 'g');
      sitemapContent = sitemapContent.replace(regex, '');
  });

  // insert before </urlset>
  sitemapContent = sitemapContent.replace('</urlset>', newSitemapUrls.join('') + '\n</urlset>');
  fs.writeFileSync(SITEMAP_FILE, sitemapContent);
  console.log('Updated sitemap.xml');
}

console.log('Successfully generated all SEO pages with internal linking!');
