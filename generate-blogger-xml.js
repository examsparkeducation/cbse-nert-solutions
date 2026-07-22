const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'seo-data.json');
const OUTPUT_FILE = path.join(__dirname, 'blogger-import.xml');

// Read the previously generated JSON data
if (!fs.existsSync(DATA_FILE)) {
  console.error("Error: seo-data.json not found. Run generate-seo-pages.js first.");
  process.exit(1);
}

const pagesData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

// Function to escape XML special characters
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// Generate Blogger Atom XML Header
let xmlContent = `<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:georss='http://www.georss.org/georss' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-12345.archive</id>
  <updated>${new Date().toISOString()}</updated>
  <title type='text'>ExamSpark SEO Pages Import</title>
  <generator version='7.00' uri='http://www.blogger.com'>Blogger</generator>
`;

// Helper to generate the Blogger HTML content for a post
function generatePostContent(page) {
    const classParam = encodeURIComponent(page.classParam);
    const subjectParam = encodeURIComponent(page.subjectParam);
    const ctaUrl = `https://examspark.in/?class=${classParam}&subject=${subjectParam}&utm_source=blogger_seo&utm_medium=cta_button&utm_campaign=${page.slug}`;

    return `
<h2>${page.section1Heading}</h2>
<p>${page.section1Text} Exams are a critical milestone in a student's academic journey. To achieve top scores, rote learning from textbooks is no longer sufficient. Students must engage in active recall and extensive practice. Our AI-powered ${page.topicName} question generator is engineered to provide an unlimited supply of high-quality, exam-oriented questions. By generating questions dynamically, it ensures that you never run out of practice material, helping you master complex concepts with ease and build the confidence needed to excel.</p>

<p style="text-align: center;">
  <a href="${ctaUrl}" style="display:inline-block; margin:20px 0; padding:12px 20px; background:#ff5722; color:white; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
    Generate ${page.topicName} Questions Now 🚀
  </a>
</p>

<h2>Why Use This ${page.shortTitle}?</h2>
<p>Most students rely only on textbooks and previous year question papers. While these are essential, they are finite resources. Once you solve them, you need fresh challenges to truly test your understanding and readiness. That is exactly what our intelligent tool provides.</p>
<p>Our advanced algorithm analyzes the core concepts of ${page.topicName} and crafts questions that challenge your analytical and problem-solving skills. Whether you need straightforward knowledge-based questions or complex application-based scenarios, our tool adapts to your exact preparation needs.</p>
<ul>
  <li><strong>Unlimited Practice:</strong> Generate endless questions, including MCQs, subjective formats, and case studies instantly.</li>
  <li><strong>Chapter-Wise Focus:</strong> Target specific chapters where you feel weak and turn those weaknesses into your strengths.</li>
  <li><strong>Latest Syllabus Aligned:</strong> All generated questions adhere strictly to the latest curriculum guidelines and exam patterns.</li>
  <li><strong>Time Efficiency:</strong> Stop wasting hours searching for scattered question banks online. Get precisely what you need in seconds.</li>
  <li><strong>Instant Self-Evaluation:</strong> Practice with immediate clarity on what type of questions might appear in the actual exam, improving your time management skills.</li>
</ul>

<h2>Comprehensive Coverage of ${page.topicName} Topics</h2>
<p>A thorough preparation requires touching every corner of the syllabus. Our AI tool is trained comprehensively across all essential topics and sub-topics within ${page.topicName}. From fundamental principles to advanced theoretical concepts, you can generate relevant questions for any specific area of study.</p>
<p>To use it effectively, simply enter the name of the chapter or topic you are currently revising. The AI will instantly compile a personalized quiz or worksheet. This targeted approach is proven to enhance memory retention and conceptual clarity significantly better than passive reading alone.</p>

<h2>Types of Questions Generated for ${page.topicName}</h2>
<p>Different exams require different answering strategies. Therefore, QSpark AI is equipped to generate a wide variety of question formats to make you fully exam-ready across all sections:</p>
<ul>
  <li><strong>Multiple Choice Questions (MCQs):</strong> Ideal for quick conceptual checks, objective sections, and competitive exams.</li>
  <li><strong>Short Answer Questions (2–3 marks):</strong> Designed to test your ability to explain concepts concisely and accurately.</li>
  <li><strong>Long Answer Questions (5 marks):</strong> Perfect for detailed theoretical explanations, derivations, and comprehensive answers.</li>
  <li><strong>Assertion & Reason:</strong> Highly prevalent in modern board and competitive exams to strictly test critical thinking and logical deduction.</li>
  <li><strong>Case Study / Passage Based:</strong> Tests your ability to apply theoretical knowledge to real-world situations or given analytical scenarios.</li>
</ul>

<p style="text-align: center;">
  <a href="${ctaUrl}" style="display:inline-block; margin:20px 0; padding:12px 20px; background:#ff5722; color:white; text-decoration:none; border-radius:8px; font-weight:bold; font-size:16px;">
    Start Practicing ${page.topicName} Now 💡
  </a>
</p>

<h2>Step-by-Step Guide: How to Use the Tool</h2>
<p>We have designed our interface to be incredibly user-friendly and intuitive. You do not need any technical expertise to start generating high-quality questions. Just follow these simple steps:</p>
<ol>
  <li><strong>Select Your Class/Exam:</strong> Choose your appropriate academic level (e.g., Class 10, Class 12, NEET, JEE) from the dropdown menu.</li>
  <li><strong>Select Your Subject:</strong> Pick the subject you wish to practice.</li>
  <li><strong>Enter the Topic:</strong> Type in the specific chapter or topic name you are currently studying.</li>
  <li><strong>Generate:</strong> Click the generate button and watch the AI instantly build your custom practice sheet.</li>
</ol>
<p>Within seconds, you will receive a comprehensive set of questions that you can use for immediate practice, assignment creation, or configuring your own mock tests.</p>

<h2>Proven Benefits for Students & Educators</h2>
<p>This platform is not just a standard tool; it is a complete, dynamic study companion. Students who integrate our AI question generator into their daily study routine report significantly higher confidence levels, improved accuracy, and better time management during their final exams.</p>
<p>Furthermore, educators, school teachers, and private tutors find immense value in our tool. It drastically reduces the time spent on creating weekly assignments and mock tests manually, allowing educators to focus more on actual teaching, mentoring, and personalized doubt-clearing sessions.</p>

<h2>Frequently Asked Questions (FAQs)</h2>
<p><strong>Is the ${page.topicName} question generator completely free to use?</strong><br>Yes, our core AI question generation features are completely free for students and teachers to use.</p>
<p><strong>Are the generated questions aligned with the latest educational syllabus?</strong><br>Absolutely. Our underlying AI model is continuously updated and prompted to ensure that the difficulty level, formatting, and content of the questions strictly align with the most recent syllabus guidelines.</p>
<p><strong>Can I download or save the generated ${page.topicName} questions?</strong><br>Yes, after generating your custom questions, you have the option to easily save or print them as a PDF document.</p>
<p><strong>How accurate are the answers provided by the AI?</strong><br>The AI is highly trained and provides extremely accurate questions and answers in most cases. However, as with any automated educational tool, we always encourage students to cross-verify with their official textbooks.</p>
    `;
}

// Generate an Atom Entry for each page
pagesData.forEach((page, index) => {
    // Generate a unique URL path for blogger
    // Blogger URLs usually look like /yyyy/mm/slug.html
    const bloggerPath = `/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${page.slug}.html`;
    
    // We can use the keywords as Blogger labels (categories)
    const labels = page.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
    let categoriesXml = '';
    labels.forEach(label => {
        categoriesXml += `<category scheme='http://www.blogger.com/atom/ns#' term='${escapeXml(label)}'/>\n`;
    });
    
    // Core Blogger category
    categoriesXml += `<category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/blogger/2008/kind#post"/>`;

    const entryXml = `
  <entry>
    ${categoriesXml}
    <title type='text'>${escapeXml(page.title)}</title>
    <content type='html'><![CDATA[${generatePostContent(page)}]]></content>
    <published>${new Date().toISOString()}</published>
    <updated>${new Date().toISOString()}</updated>
    <author>
      <name>QSpark AI</name>
    </author>
  </entry>`;
    
    xmlContent += entryXml;
});

// Close feed
xmlContent += `\n</feed>`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, xmlContent);
console.log(`Successfully generated blogger-import.xml with ${pagesData.length} posts!`);
