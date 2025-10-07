import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  margin: 2rem 0;
`;

const InterpretationCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(props) => props.color || "#6200ff"};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => props.bgColor || "#f0f0ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
`;

const CardTitle = styled.h3`
  color: #150137;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
`;

const CardContent = styled.div`
  color: #333;
  line-height: 1.8;
  font-size: 1rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const FeatureItem = styled.div`
  background: #f8f8ff;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.bgColor || "#e0e0ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const FeatureText = styled.div`
  flex: 1;

  .label {
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .value {
    color: #150137;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const AccordionItem = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const AccordionHeader = styled.div`
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;

  &:hover {
    background: #f8f8ff;
  }
`;

const AccordionContent = styled(motion.div)`
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.8;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const interpretationConfig = {
  personality: {
    icon: "🧠",
    bgColor: "#e3f2fd",
    color: "#2196f3",
    title: "성격 분석",
  },
  career: {
    icon: "💼",
    bgColor: "#f3e5f5",
    color: "#9c27b0",
    title: "직업운",
  },
  relationship: {
    icon: "❤️",
    bgColor: "#fce4ec",
    color: "#e91e63",
    title: "연애/결혼운",
  },
  wealth: {
    icon: "💰",
    bgColor: "#e8f5e9",
    color: "#4caf50",
    title: "재물운",
  },
  health: {
    icon: "🏥",
    bgColor: "#fff3e0",
    color: "#ff9800",
    title: "건강운",
  },
  fortune: {
    icon: "🌟",
    bgColor: "#fafafa",
    color: "#ffc107",
    title: "올해 운세",
  },
};

export default function SajuInterpreterDisplay({ interpretation, advanced }) {
  const [expandedAccordions, setExpandedAccordions] = useState({});

  const toggleAccordion = (key) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderInterpretationCard = (key, content) => {
    if (!content) return null;
    const config = interpretationConfig[key];
    if (!config) return null;

    return (
      <InterpretationCard
        key={key}
        color={config.color}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader>
          <IconWrapper bgColor={config.bgColor}>{config.icon}</IconWrapper>
          <CardTitle>{config.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {content.split("\n").map((line, i) => (
            <p key={i} style={{ margin: "0.5rem 0" }}>
              {line}
            </p>
          ))}
        </CardContent>
      </InterpretationCard>
    );
  };

  const renderAdvancedAnalysis = () => {
    if (!advanced) return null;

    return (
      <>
        {advanced.zodiac && (
          <ChartCard>
            <CardTitle style={{ marginBottom: "1.5rem" }}>
              띠 특성 분석 {advanced.zodiac.animal}
            </CardTitle>
            <FeatureGrid>
              <FeatureItem>
                <FeatureIcon bgColor="#e3f2fd">🎭</FeatureIcon>
                <FeatureText>
                  <div className="label">성격</div>
                  <div className="value">{advanced.zodiac.personality}</div>
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon bgColor="#f3e5f5">💼</FeatureIcon>
                <FeatureText>
                  <div className="label">적합 직업</div>
                  <div className="value">{advanced.zodiac.career}</div>
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon bgColor="#fce4ec">💑</FeatureIcon>
                <FeatureText>
                  <div className="label">궁합</div>
                  <div className="value">{advanced.zodiac.compatibility}</div>
                </FeatureText>
              </FeatureItem>
            </FeatureGrid>
          </ChartCard>
        )}

        {advanced.specialPattern && (
          <AccordionItem>
            <AccordionHeader onClick={() => toggleAccordion("special")}>
              <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                🌟 특별한 격국
              </span>
              <span>{expandedAccordions.special ? "−" : "+"}</span>
            </AccordionHeader>
            <AnimatePresence>
              {expandedAccordions.special && (
                <AccordionContent
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {advanced.specialPattern}
                </AccordionContent>
              )}
            </AnimatePresence>
          </AccordionItem>
        )}

        {advanced.daeunAnalysis && (
          <AccordionItem>
            <AccordionHeader onClick={() => toggleAccordion("daeun")}>
              <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                📊 대운 분석
              </span>
              <span>{expandedAccordions.daeun ? "−" : "+"}</span>
            </AccordionHeader>
            <AnimatePresence>
              {expandedAccordions.daeun && (
                <AccordionContent
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {advanced.daeunAnalysis}
                </AccordionContent>
              )}
            </AnimatePresence>
          </AccordionItem>
        )}

        {advanced.timelyFortune && (
          <ChartCard>
            <CardTitle style={{ marginBottom: "1.5rem" }}>
              📅 올해 상세 운세
            </CardTitle>
            <FeatureGrid>
              <FeatureItem>
                <FeatureIcon bgColor="#fce4ec">💕</FeatureIcon>
                <FeatureText>
                  <div className="label">연애운</div>
                  <div className="value">{advanced.timelyFortune.love}</div>
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon bgColor="#e8f5e9">💸</FeatureIcon>
                <FeatureText>
                  <div className="label">재물운</div>
                  <div className="value">{advanced.timelyFortune.wealth}</div>
                </FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon bgColor="#fff3e0">⚕️</FeatureIcon>
                <FeatureText>
                  <div className="label">건강운</div>
                  <div className="value">{advanced.timelyFortune.health}</div>
                </FeatureText>
              </FeatureItem>
            </FeatureGrid>
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "#f8f8ff",
                borderRadius: "12px",
              }}
            >
              <strong>💡 조언:</strong> {advanced.timelyFortune.advice}
            </div>
          </ChartCard>
        )}
      </>
    );
  };

  return (
    <Container>
      {interpretation &&
        Object.entries(interpretation).map(([key, value]) => {
          if (typeof value === "string" && interpretationConfig[key]) {
            return renderInterpretationCard(key, value);
          }
          return null;
        })}

      {renderAdvancedAnalysis()}
    </Container>
  );
}
