import React from 'react';
import './Landing.scss';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard';
import { Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import Landing_page_card from '../../Utils/CommonElements/landing_page_card/Landing_page_card';
import FeaturesJson from '../../assets/Jsons/HomeFeatures.json';

// ✅ Import ONLY the icons you actually use (6 icons)
import { LuImageUp, LuLink } from "react-icons/lu";
import { PiSelectionBackgroundDuotone } from "react-icons/pi";
import { VscJson } from "react-icons/vsc";
import { MdOutlineGeneratingTokens, MdOutlineQrCodeScanner } from "react-icons/md";

const LandingPage = () => {

  // Icon lookup table (dynamic)
  const Icons: Record<string, React.ComponentType> = {
    LuImageUp,
    LuLink,
    PiSelectionBackgroundDuotone,
    VscJson,
    MdOutlineGeneratingTokens,
    MdOutlineQrCodeScanner
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const features = FeaturesJson.features;

  return (
    <div className='landing_page_container'>
      <div className='landing_header_conatainer'>
        <h1>Access All your important Tools, ONLINE.</h1>
      </div>

      {features.map((feature: any) => (
        <Row key={feature.groupId} className='landing_page_features'>
          <Col
            span={16}
            xs={{ span: 23 }}
            sm={{ span: 23 }}
            md={{ span: 22 }}
            lg={{ span: 16 }}
            className='parent_card'
          >
            <CommonCard>
              <div className='child_folder'>
                <h2 className='feature_name'>{feature.name}</h2>

                <div className='child_card_container'>
                  {feature.children.map((childFeature: any) => {
                    const IconJSX = renderIcon(childFeature.icon);

                    return (
                      <div key={childFeature.childId} className='child_card'>
                        <Link to={childFeature.route}>
                          <Landing_page_card
                            icon={IconJSX}
                            name={childFeature.name}
                            description={childFeature.description}
                            badge={childFeature.badge}
                            badgeText={childFeature.badgeText}
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CommonCard>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default LandingPage;
