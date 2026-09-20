import { HydroStation, AdvisoryResponse, Language } from '../types';

/**
 * Deterministic Central Ground Water Board (CGWB) & Tripura Water Resources advisory generator.
 * Provides instant, reliable engineering recommendations for well drilling, rig selection,
 * screen interval placement, and casing specifications across all Tripura sedimentary formations.
 * Used both on the client (ensuring 100% uptime on static hosts like Vercel) and on the backend.
 */
export function generateHydrogeologicalAdvisory(
  station: HydroStation,
  lang: Language = 'en'
): AdvisoryResponse {
  const isBengali = lang === 'bn';
  const isHindi = lang === 'hi';

  const isPiezometer = station.type === 'PZ';
  const isDeclining = station.trend_fall > 0.1;
  const targetMin = isPiezometer
    ? Math.max(70, Math.round(station.pre_depth * 4))
    : Math.max(35, Math.round(station.pre_depth * 5));
  const targetMax = targetMin + (isPiezometer ? 45 : 30);

  const riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical' =
    station.risk < 30 ? 'Low' : station.risk < 50 ? 'Moderate' : station.risk < 70 ? 'High' : 'Critical';

  if (isBengali) {
    return {
      formationAnalysis: `${station.location}-এর আশেপাশের ভূপ্রকৃতি মূলত ${station.terrain} দ্বারা গঠিত। এই ভূতাত্ত্বিক ভাঁজ অঞ্চলে প্রধান ভূগর্ভস্থ জলভাণ্ডার অর্ধ-সংহত মিহি থেকে মাঝারি স্যান্ডস্টোন এবং কাদামাটির স্তরের মধ্যে আবদ্ধ থাকে, যেখানে ${
        station.trend_fall > 0
          ? 'মৌসুমি জলস্তর হ্রাসের লক্ষণ রয়েছে'
          : 'ধারাবাহিক প্রাকৃতিক পুনর্ভরণ বজায় রয়েছে'
      }।`,
      preDrillingAdvice: [
        `মৌসুমি অগভীর জলস্তর ওঠানামা এড়াতে ${targetMin} মিটার থেকে ${targetMax} মিটার গভীরতার জলস্তরকে লক্ষ্য করে ড্রিলিং সম্পন্ন করুন।`,
        `বেন্টোনাইট মিশ্রণ সহ সরাসরি রোটারি ড্রিলিং পদ্ধতি ব্যবহার করুন; ১৫০/২০০ মিমি ব্যাসের আইএসআই মার্কযুক্ত কেসিং এবং ০.৫–০.৭৫ মিমি স্লটেড পিভিসি ফিল্টার স্থাপন করুন।`,
        `${station.district} অঞ্চলে মিহি বালির প্রবেশ আটকাতে ফিল্টারের চারপাশে অন্তত ৬ মিটার উচ্চতা পর্যন্ত সুষম মটরদানার মতো নুড়িপাথর (২.০–৩.৫ মিমি গ্র্যাভেল প্যাক) ব্যবহার করুন।`,
      ],
      contractorQuestions: [
        `কেসিং পাইপ নামানোর পূর্বে বালির স্তর সঠিকভাবে শনাক্ত করতে বৈদ্যুতিক রেজিস্টিভিটি লগিং (SP/Resistivity Log) করবেন কি?`,
        `মাইকা ও মিহি পলি দ্বারা ফিল্টার জ্যাম হওয়া ঠেকাতে কী নির্দিষ্ট আকারের গ্র্যাভেল প্যাকিং ব্যবহার করা হবে?`,
        `বোরিং সমাপ্তির পর অন্তত ৪ ঘণ্টা এয়ার কম্প্রেসার দ্বারা ডেভলপমেন্ট এবং ডিসচার্জ ফলন পরীক্ষা (LPS Test) অন্তর্ভুক্ত রয়েছে কি?`,
      ],
      waterQualityNotes: `${station.district} জেলার জলস্তরে প্রায়শই টিপাম/সুরমা শিলাস্তরের কারণে দ্রবীভূত আয়রনের (Fe > ১.০ মিগ্রা/লি) উপস্থিতি দেখা যায়। কুয়োর মুখে বায়ু-সঞ্চালন (Aeration) এবং বালি-নুড়ি ফিল্টারিং ইউনিট স্থাপন সুপারিশকৃত।`,
      riskAssessment: {
        level: riskLevel,
        rationale: `বর্ষা-পূর্ববর্তী স্থির জলের স্তর ${station.pre_depth} মিটার, যেখানে ${
          isDeclining
            ? `বার্ষিক ${station.trend_fall} মি/বছর হারে জলস্তর হ্রাস ভূগর্ভস্থ অতিরিক্ত ব্যবহারের ইঙ্গিত দেয়`
            : `মৌসুমি সুষম পুনর্ভরণ (+${station.trend_rise} মি/বছর) পরিলক্ষিত হয়`
        }।`,
        recommendedDepth: `${targetMin} – ${targetMax} মিটার`,
      },
      isLiveAi: false,
      modelUsed: 'cgwb-hydrogeology-engine',
    };
  }

  if (isHindi) {
    return {
      formationAnalysis: `${station.location} के आसपास का भूविज्ञान मुख्यतः ${station.terrain} शैल संरचना द्वारा निर्मित है। इस भूवैज्ञानिक संरचना में प्राथमिक भूजल भंडार अर्ध-संलग्न मध्यम व महीन बलुआ पत्थर (सैंडस्टोन) और अप्रवेश्य शेल परतों में संचित रहता है, जो ${
        station.trend_fall > 0 ? 'वार्षिक जल स्तर गिरावट के दबाव' : 'स्थिर मौसमी प्राकृतिक पुनर्भरण'
      } को दर्शाता है।`,
      preDrillingAdvice: [
        `मौसमी सतही जलस्तर के उतार-चढ़ाव से बचने के लिए ${targetMin} मीटर से ${targetMax} मीटर गहराई वाले गहरे जलभृत क्षितिज को लक्षित करें।`,
        `बेंटोनाइट मड सर्कुलेशन के साथ डायरेक्ट रोटरी ड्रिलिंग का उपयोग करें; झरझरे सैंडस्टोन स्तरों पर 150/200 मिमी व्यास की आईएसआई मार्क पीवीसी केसिंग व 0.5–0.75 मिमी स्लॉटेड स्क्रीन स्थापित करें।`,
        `${station.district} में महीन गाद व रेत को रोकने के लिए स्क्रीन के चारों ओर कम से कम 6 मीटर ऊंचाई तक 2.0–3.5 मिमी आकार का एकसमान मटर के आकार का बजरी पैक (Gravel Pack) भरें।`,
      ],
      contractorQuestions: [
        `केसिंग पाइप स्थापित करने से पूर्व बलुआ पत्थर की परतों की सही पहचान हेतु क्या आप एसपी/इलेक्ट्रिकल रेसिस्टिविटी लॉगिंग करेंगे?`,
        `माइका और महीन सिल्ट से फ़िल्टर को चोक होने से बचाने के लिए किस ग्रेड व मात्रा का ग्रेवल पैक उपयोग में लाया जाएगा?`,
        `क्या ड्रिलिंग कार्य पूर्ण होने के पश्चात न्यूनतम 4 घंटे का एयर कंप्रेसर विकास और एलपीएस (LPS) डिस्चार्ज यील्ड परीक्षण शामिल है?`,
      ],
      waterQualityNotes: `${station.district} ज़िले के जलभृतों में तिपम/सुरमा श्रृंखला के कारण घुलित आयरन (Fe > 1.0 mg/L) की अधिकता पाई जा सकती है। कुएं के निर्वहन बिंदु पर वातन (Aeration) व सैंड-ग्रेवल फ़िल्टर इकाई लगाना अनुशंसित है।`,
      riskAssessment: {
        level: riskLevel,
        rationale: `मानसून पूर्व स्थिर जल स्तर ${station.pre_depth} मीटर (mbgl) है, जिसमें ${
          isDeclining
            ? `वार्षिक ${station.trend_fall} मी/वर्ष की गिरावट निष्कर्षण दबाव दर्शाती है`
            : `संतुलित मौसमी पुनर्भरण (+${station.trend_rise} मी/वर्ष) देखा गया है`
        }।`,
        recommendedDepth: `${targetMin} – ${targetMax} मीटर`,
      },
      isLiveAi: false,
      modelUsed: 'cgwb-hydrogeology-engine',
    };
  }

  // Default English
  return {
    formationAnalysis: `The hydrogeology around ${station.location} is dominated by ${station.terrain}. In this synclinal fold belt, the primary groundwater reservoir occurs in semi-consolidated fine-to-medium sandstones interbedded with impervious shale lenses, displaying ${
      station.trend_fall > 0 ? 'accelerated seasonal depression' : 'steady perennial recharge'
    }.`,
    preDrillingAdvice: [
      `Target deep aquifer horizon between ${targetMin}m and ${targetMax}m depth to bypass seasonal unconfined water table fluctuations.`,
      `Employ direct rotary drilling with bentonite circulation; install 150mm/200mm diameter ISI casing with precision slotted PVC screens (slot size 0.5–0.75mm) across porous sandstone layers.`,
      `Install uniform pea-gravel packing (2.0–3.5mm) around the annular space up to 6 meters above the top strainer to prevent fine sand migration common in ${station.district}.`,
    ],
    contractorQuestions: [
      `Will you conduct an electrical resistivity log (SP/Resistivity logging) before lowering the casing to pinpoint granular sand beds?`,
      `What gravel packing grading and volume will you pack into the annular column to prevent screen clogging by micaceous silt?`,
      `Do you include a minimum 4-hour air compressor development and yield discharge test (LPS) upon completion?`,
    ],
    waterQualityNotes: `Aquifers across ${station.district} frequently exhibit elevated dissolved Iron (Fe > 1.0 mg/L) associated with reducing subsurface conditions in the Tipam/Surma series. An atmospheric aeration and sand-gravel filter unit is recommended at the well discharge.`,
    riskAssessment: {
      level: riskLevel,
      rationale: `Pre-monsoon static water level is ${station.pre_depth} mbgl with ${
        isDeclining
          ? `an annual fall rate of ${station.trend_fall} m/yr indicating extraction stress`
          : `balanced seasonal replenishment (+${station.trend_rise} m/yr)`
      }.`,
      recommendedDepth: `${targetMin} – ${targetMax} meters`,
    },
    isLiveAi: false,
    modelUsed: 'cgwb-hydrogeology-engine',
  };
}
