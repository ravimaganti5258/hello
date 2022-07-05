import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../assets/styles/colors/colors';
import { ModalContainer } from '../../../components/Modal';
import { Text } from '../../../components/Text';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { Note, Mail, ViewIcon } from '../../../assets/img/index';
import { strings } from '../../../lib/I18n/index.js';
import ServiceReportDetailsModal from './ServiceReportModal';
import { useColors } from '../../../hooks/useColors';
import api from '../../../lib/api';
import Loader from '../../../components/Loader/index.js';
import { FlashMessageComponent } from '../../../components/FlashMessge/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import AddMoreModal from '../../screens/JobList/addMore'
import {
  serviceReportdisable,
  getPDFBase64,
  getHtmlTemplate,
} from '../../../redux/serviceReport/action';
import * as HTML from './htmlTemplate';

const EquipmentServiceReportModal = ({
  visibility,
  handleModalVisibility,
  jobDetailsNew,
  priceDetailsNew
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { height, width } = useDimensions();
  const insets = useSafeAreaInsets();
  const [servideDetailsPopUP, setServideDetailsPopUP] = useState(false);
  const [showAddMore, setShowAddMore] = useState(false);
  const [loader, setLoader] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const { colors } = useColors();
  const jobDetails = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const modal = useSelector(
    (state) => state?.ServiceReportReducer?.serviceReportVisible,
  );
  const jobSettingFlag = useSelector(
    (state) => state?.ServiceReportReducer?.emailPrintJobSetting,
  );
  const [base64HtmlData, setBase64HtmlData] = useState(``);

  const onPressButton = () => {
    setServideDetailsPopUP(!servideDetailsPopUP);
  };

  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };

  useEffect(() => {
    getBase64FromHtml();
  }, []);

  let htmlData = `<html>
    <style> .Tbl-Border  tbody > tr > th,.Tbl-Border tbody > tr > td {border: 1px solid #bfbfbf; } .Tbl-Border  tbody > tr > th{border-bottom: none} .Tbl-Border tr td,.Tbl-Border tr th { page-break-inside: avoid !important;}.header-Border  {border: 1px solid #bfbfbf; } #printArea{ -webkit-print-color-adjust: exact; }  #footer { position: fixed; width: 100%; bottom: 0; left: 0; right: 0; padding:8px; page-break-after: always; }    tfoot { display: table-footer-group;} .checked { color: #ffdb10 !important; border-color: #ffdb10 !important; }</style>
    <body>
        <div id=\"PrintPanel\">
            <div id=\"printContainer\" style=\"background: #fff;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; margin: 0 auto;\">
            <tbody>
                <!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}-->
                <div class=\"ng-star-inserted\">
                <table style=\"padding: 0px; margin: 0px; line-height: 1.42; font-weight: normal; font-family: 'Lucida Sans Unicode';\" width=\"100%\">
            <tbody><tr><td align=\"left\" style=\"text-align: left;\" width=\"60%\">&nbsp;</td><td align=\"right\" style=\"text-align: right;\" width=\"40%\">&nbsp;</td></tr><tr><td align=\"left\" style=\"text-align: left;\" width=\"60%\"><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><div class=\"ng-star-inserted\"> <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAIAAACdjxhxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJdSURBVDhPdZJfSNNxFMX31LM9VBBYbxXUc1+TZdZ0UCFMoVAs0vnii8Mli0DQSbCMElv+qebGJDVNZ+pg0oJtCE6lDCtDRKMwKIYocxSV1u10r9ry5wo+D+ece+/5/hjTEaDhCyhSTj4lsGC7bSEFbUUC9DCLZk5T3EQJkwi2HG7dSUFTsfqgikLZtDJK00p4qSh0QsItO6loKt7bcsithOF12tTPNiXhlp1UNBWTJdny8qSi70Za1NMT0RLylECvvRQ2CCzY/rnSVLyqu5ZhdE1VGOauZs3bMqctJ9lyKNOBapoqoB/n6ZueoooG65JX2p8TqKh+l+h6tNb7mGHBdiP/WKioQ5FfUb8ij1ooUsmT7RUDIYStl1faOxkWbDfy0Ry1FFYUP0ZzKj6kRnP/X/HhF+4VFPjKyhgWbDfybmes1NQct1d9tltK8lu778SSJ5qK/gWYfKgz1y+73AwLthzyaI1bbkSop5NhwTZ5tVkRXYY5AL0b5ue40AwaCjDFLSh9th4GZMF1c6rvjGJYJO8ZqfDOQLVCuVEUkZtTHbjlEliwLQxjYhn5ARgaQO23GRZsOfxbkeGEoQvGXuT55ea4B6v8T4W8vwRUPsXBBuSNIHMY9c4Ew+JsGIcaYQ3Kgi5OSLdJRW7PZgV/0dtF4WgLRj5hdw1yfbg0Ab0fvMxPsrg4hpxB7KmVBV1wHOfqsascey3YfwUHanHkOho9wmEHesaxoxhpVuxzYKcdTb1w9iGtBukOpFXKiBd0X4EX8xh7829mY/CG0RTE3RDuRzAUxWBUBFsOeTQbw2/Oakiot/av4QAAAABJRU5ErkJggg=='/> </div><div style=\"font-size: 13px !important;font-family: Lucida Sans Unicode;color: #7F7881;margin-top:1%\">  85 Lincoln Highway  Edison New Jersey 08820 USA</div></td><td align=\"right\" style=\"font-size: 30px;text-align: right; color: #aba7a7\" width=\"40%\"><b> Job Details</b></td></tr><tr width=\"100%\"><td style=\"text-align: left;width:35%\"><table style=\"width: 100%;\">
            <tbody>
                <tr><td style=\"font-size: 12px; vertical-align: top; font-family: 'Lucida Sans Unicode';\"><br><br><br><br></td></tr>
                <tr><td style=\"font-size: 12px; vertical-align: top; font-family: 'Lucida Sans Unicode';\"></td></tr>
                <tr>
                <td style=\"font-size: 12px; vertical-align: top;width:50%; \"><div style=\"border:1px;border-style:solid;border-color:black;height: 25px; display: block;padding-top: 7px !important;padding-bottom: 7px !important;padding-left: 5px !important;padding-right: 5px !important; float: left;background-color: #e7e7e7;\"><span><b style=\"font-size: 12px;margin-top: 10px\">Service Address</b></span><br><br>
        </div>
        <br><table style=\"width:100%;\"><tbody><tr><td style=\"height:20px;font-size:12px;\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.AddressLine1},${jobDetailsNew[0]?.TechnicianJobInformation?.AddressLine2},   </td></tr><tr><td style=\"height:20px;font-size:12px;\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.CityName},${jobDetailsNew[0]?.TechnicianJobInformation?.Region},${jobDetailsNew[0]?.TechnicianJobInformation?.CountryName} </td></tr><!--bindings={\n  \"ng-reflect-ng-if\": null\n}-->
        <!--bindings={\n  \"ng-reflect-ng-if\": null\n}--><!--bindings={\n  \"ng-reflect-ng-if\": null\n}--></tbody></table><br></td><td style=\"font-size: 12px; vertical-align: top;width:50%; \"><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->
        <div class=\"header-Border ng-star-inserted\" style=\"display: block;padding-top: 7px !important;padding-bottom: 7px !important;padding-left: 5px !important;padding-right: 5px !important;height: 25px; float: left; background-color: #e7e7e7;\"><span style=\"font-size: 12px;\">
        <b>Billing Address</b></span></div><br><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><table style=\"width:100%;\" class=\"ng-star-inserted\"><tbody><tr><td style=\"height:20px;font-size:12px;\"> New Jersey(NJ),   </td></tr><tr><td style=\"height:20px;font-size:12px;\"> Jersey City, NJ, 07850, </td></tr><!--bindings={\n  \"ng-reflect-ng-if\": null\n}-->
        <!--bindings={\n  \"ng-reflect-ng-if\": null\n}--><!--bindings={\n  \"ng-reflect-ng-if\": null\n}--></tbody></table><br></td></tr></tbody></table><br><br></td><td style=\"text-align: left;vertical-align: top;width:65%\">
        <table cellspacing=\"0\" class=\"Tbl-Border\" style=\"width:100%;\">
            <tbody>
                <tr width=\"100%\"><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\"> Job # (WO #) </td><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.WoJobId}(${jobDetailsNew[0]?.TechnicianJobInformation?.WoNumber}) </td></tr>
                <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->
                <tr width=\"100%\"><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\"> Job Status </td><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.JobStatus} </td></tr>
                <tr width=\"100%\">
                <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\" class=\"ng-star-inserted\"> Customer Type </td><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.CustomerType} </td>
                </tr>
                <tr width=\"100%\">
                <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\" class=\"ng-star-inserted\"> Customer Name </td><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right;; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.CustomerName} </td>
                </tr>
                <tr width=\"100%\">
                <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\" class=\"ng-star-inserted\"> Customer ID </td><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\" class=\"ng-star-inserted\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.CustomerId} </td><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->
                </tr>
                <!--bindings={\n  \"ng-reflect-ng-if\": null\n}-->
                <tr width=\"100%\"><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\"> Created On </td><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.CreatedDate}</td></tr>
                <!--bindings={\n  \"ng-reflect-ng-if\": \"12/7/21 7:00 AM\"\n}-->
                <tr width=\"100%\" class=\"ng-star-inserted\"><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\"> Scheduled On </td><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\">${jobDetailsNew[0]?.TechnicianJobInformation?.ScheduleStartDateTime}  </td></tr>
                <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->
                <tr width=\"100%\"><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\"> Vendor </td><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.VendorName}</td></tr>
                <tr width=\"100%\"><td style=\"padding: 5px 6px 5px 13px;height:20px;background-color:#f2f2f2;font-size: 12px;text-align:right;\" width=\"50%\"> Technician </td><td style=\"padding: 2px 6px 2px 13px;font-size: 12px;text-align:right; \" width=\"50%\"> ${jobDetailsNew[0]?.TechnicianJobInformation?.TechDisplayName} </td></tr>
            </tbody>
        </table>
        <br><br></td></tr></tbody></table></div><table style=\"padding:0px;margin:0px;line-height: 1.42;font-weight:normal;font-family: 'Lucida Sans Unicode';\" width=\"100%\">
        <tbody>
            <tr>
                <td width=\"100%\">
                <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">
                    <tbody>
                        <!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}--><!---->
                        <tr class=\"ng-star-inserted\">
                            <td><div class=\"main-heading\" style=\" font-family: 'Lucida Sans Unicode';font-size:15px;\"><b style=\"font-size: 13px!important;margin: 25px 0 5px 0;\">Job Details</b><br><br></div></td>
                        </tr>
                        <tr class=\"ng-star-inserted\">
                            <td>
                            <table cellspacing=\"0\" class=\"Tbl-Border\" style=\"width:100%;\">
                                <tbody>
                                    <tr style=\"font-size: 12px;background-color:#e4e4e4;text-align:center; font-weight:600;\"><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"10%\"><span style=\"font-size: 12px;\"> Category </span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"17%\"><span style=\"font-size: 12px;\"><b>Work Type</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"25%\"><span style=\"font-size: 12px;\"><b>Work Request</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"24%\"><span style=\"font-size: 12px;\"><b>Duration</b></span></th></tr>
                                   ${jobDetailsNew[0]?.WOJobDetails?.map(job => {
    return `<!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}-->
                                    <tr style=\"font-size: 12px;\" class=\"ng-star-inserted\"><td style=\"padding: 5px 6px 5px 3px;height:25px;\"><span style=\"font-size: 12px;\n                                                                        color: #c0c0c0 !important;\n                                                                        line-height: 30px;\n                                                                        padding-left: 3px;\">${job?.WoCategory}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\n                                                                    color: #c0c0c0 !important;\n                                                                    line-height: 30px;\n                                                                    padding-left: 3px;\">${job?.WorkType}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px;\"><span style=\"font-size: 12px;\n                                                                    color: #c0c0c0 !important;\n                                                                    line-height: 30px;\n                                                                    padding-left: 3px;\">${job?.WorkTask}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px;\"><span style=\"font-size: 12px;\n                                                                        color: #c0c0c0 !important;\n                                                                        line-height: 30px;\n                                                                        padding-left: 3px;\"> ${job?.Days > 1 ? ` ${job?.Days} Days` : job?.Days == 1 ? ` ${job?.Days} Day` : ''}
                                    ${job?.Hours > 1 ? ` ${job?.Hours} Hrs` : ` ${job?.Hours} Hr`}
                                    ${job?.Minutes > 1 ? ` ${job?.Minutes} Mins` : ` ${job?.Minutes} Min`}</span></td></tr><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->`
  })}
                                   
                                </tbody>
                            </table>
                            </td>
                        </tr>
                        <!--bindings={\n  \"ng-reflect-ng-for-of\": \"\"\n}--><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[0]?.IsEnabled === 1
      ? `<tr class=\"ng-star-inserted\">
      <td>
      <br><br><br><div class=\"main-heading\" style=\" font-family: 'Lucida Sans Unicode';font-size:15px;\"><b style=\"font-size: 13px!important;margin: 25px 0 5px 0;\">SLA Details</b><br><br></div>
      <table cellspacing=\"0\" class=\"Tbl-Border\" style=\"width:100%;\">
          <tbody>
              <tr style=\"font-size: 12px;background-color:#e4e4e4;text-align:center; font-weight:600;\"><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"24%\"><span style=\"font-size: 12px;\"><b>SLA Name</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"16%\"><span style=\"font-size: 12px;\"><b>SLA Type</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"23%\"><span style=\"font-size: 12px;\"><b>SLA</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"23%\"><span style=\"font-size: 12px;\"><b>SLA Ends at</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"14%\"><span style=\"font-size: 12px;\"><b>SLA Status</b></span></th></tr><!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}--><tr style=\"font-size: 12px;\" class=\"ng-star-inserted\">
              ${jobDetailsNew[0]?.SLADetails?.map(sla => {
        return `<!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td style=\"padding: 5px 6px 5px 3px;height:25px; \" rowspan=\"1\" class=\"ng-star-inserted\"><span style=\"font-size: 12px;\n
              color: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${sla?.PriorityName}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${sla?.SLAType}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${sla?.SLAType == "Resolution" ? sla?.ResolutionSLADurationType : sla?.ResponseSLADurationType}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${sla?.SLAEndTime}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${sla?.IsSLAMet}</span></td></tr><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->`
      })}
              </tbody>
      </table>
      </td>
      </tr>`
      : ``
    }
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[1]?.IsEnabled === 1
      ? `<tr class=\"ng-star-inserted\">
      <td>
      <br><br><br><div class=\"main-heading\" style=\" font-family: 'Lucida Sans Unicode';font-size:15px;\"><b style=\"font-size: 13px!important;margin: 25px 0 5px 0;\">Equipment</b><br><br></div>
      <table cellspacing=\"0\" class=\"Tbl-Border\" style=\"width:100%;\">
          <tbody>
              <tr style=\"font-size: 12px;background-color:#e4e4e4;text-align:center; font-weight:600;\"><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"18%\"><span style=\"font-size: 12px;\"><b>Brand</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"35%\"><span style=\"font-size: 12px;\"><b>Model</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"16%\"><span style=\"font-size: 12px;\"><b>Serial #</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"21%\"><span style=\"font-size: 12px;\"><b>Tag #</b></span></th></tr>
              ${jobDetailsNew[0]?.GetJobEquipment?.map(equ => {
        return `<!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}-->
             <tr style=\"font-size: 12px;\" class=\"ng-star-inserted\"><td style=\"padding: 5px 6px 5px 3px;height:25px;\"><span style=\"font-size: 12px;\n                                                                        color: #c0c0c0 !important;\n                                                                        line-height: 30px;\n                                                                        padding-left: 3px;\">${equ?.Brand}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\n                                                                    color: #c0c0c0 !important;\n                                                                    line-height: 30px;\n                                                                    padding-left: 3px;\">${equ?.Model}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px;\"><span style=\"font-size: 12px;\n                                                                    color: #c0c0c0 !important;\n                                                                    line-height: 30px;\n                                                                    padding-left: 3px;\">${equ?.SerialNo}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px;\"><span style=\"font-size: 12px;\n                                                                        color: #c0c0c0 !important;\n                                                                        line-height: 30px;\n                                                                        padding-left: 3px;\">${equ.TagNo}</span></td></tr><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->`
      })}
          </tbody>
      </table>
      </td>
      </tr>`
      : ``
    }
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[2]?.IsEnabled === 1
      ? `<tr class=\"ng-star-inserted\">
      <td>
      <br><br><br><div class=\"main-heading\" style=\" font-family: 'Lucida Sans Unicode';font-size:15px;\"><b style=\"font-size: 13px!important;margin: 25px 0 5px 0;\">Part Requests</b><br><br></div>
      <table cellspacing=\"0\" class=\"Tbl-Border\" style=\"width:100%;\">
          <tbody>
              <tr style=\"font-size: 12px;background-color:#e4e4e4;text-align:center; font-weight:600;\"><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"24%\"><span style=\"font-size: 12px;\"><b>SLA Name</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"16%\"><span style=\"font-size: 12px;\"><b>SLA Type</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"23%\"><span style=\"font-size: 12px;\"><b>SLA</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"23%\"><span style=\"font-size: 12px;\"><b>SLA Ends at</b></span></th><th style=\"padding: 5px 6px 5px 3px;height:25px; text-align:left;\" width=\"14%\"><span style=\"font-size: 12px;\"><b>SLA Status</b></span></th></tr><!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}--><tr style=\"font-size: 12px;\" class=\"ng-star-inserted\">
              ${jobDetailsNew[0]?.GetPartRequestList?.map(part => {
        return `<!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td style=\"padding: 5px 6px 5px 3px;height:25px; \" rowspan=\"1\" class=\"ng-star-inserted\"><span style=\"font-size: 12px;\n
              color: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${part?.PartRequestNo}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${part?.PartNo}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${part?.Description}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${part?.RequestedQty}</span></td><td style=\"padding: 5px 6px 5px 3px;height:25px; \"><span style=\"font-size: 12px;\ncolor: #c0c0c0 !important;\nline-height: 30px;\npadding-left: 3px;\">${part?.PartReqStatus}</span></td></tr><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->`
      })}
              </tbody>
      </table>
      </td>
      </tr>`
      : ``
    }
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[3]?.IsEnabled === 1
      ? HTML.shippingDetails
      : ``
    }
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[4]?.IsEnabled === 1
      ? HTML.rmaDetails
      : ``
    }
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[5]?.IsEnabled === 1
      ? HTML.pricingDetails(priceDetailsNew)
      : ``
    }
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!---->
                        ${jobSettingFlag[9]?.IsEnabled === 1
      ? HTML.photoAttachedToForm
      : ``
    }
            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->
            ${jobSettingFlag[17]?.IsEnabled === 1 ? `<tr class=\"ng-star-inserted\">
            <td><br><br><div class=\"main-heading\" style=\" font-family: 'Lucida Sans Unicode';font-size:12px;\"><b style=\"font-size: 15px!important;margin: 25px 0 5px 0;\">Technician Remarks</b><br><br></div></td>
            </tr>`: ``}
            <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->
            <tr class=\"ng-star-inserted\">
            
                <td style=\"text-align:justify;font-size:12px;\">
                <!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object],[object Object\"\n}--><span style=\"line-height: 20px;padding: 6px 0;\" class=\"ng-star-inserted\"><span>Technichan Remarks test</span><br><br></span>
                </td>
            </tr>
            <!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->
            <tr width=\"100%\" class=\"ng-star-inserted\">
                <td width=\"100%\">
                <!--bindings={\n  \"ng-reflect-ng-for-of\": \"[object Object]\"\n}--><!----><div style=\"font-family: 'Lucida Sans Unicode';font-size:15px;display: block; float: left;\" class=\"ng-star-inserted\"><br><br><span><b>Photo / Attachement Form</b></span><br><br></div>
                <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"ng-star-inserted\">
                    <tbody>
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->
                        <tr width=\"100%\" class=\"ng-star-inserted\">
                            <td width=\"100%\">
                            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->
                            </td>
                        </tr>
                        <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}-->
                        <tr border=\"0\" width=\"100%\" class=\"ng-star-inserted\">
                            <td width=\"100%\">
                            <table width=\"100%\">
                                <tbody>
                                    <tr width=\" 100%\"><td width=\" 100%\"><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--></td></tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br><br>
                </td>
            </tr>
            <!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><!----><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}--><!----><!----><tr width=\" 100%\"><td width=\" 100%\"><br><br><br>
            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">
                <tbody>
                <tr>
                    <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><td colspan=\"2\" style=\"width: 60%;\" class=\"ng-star-inserted\">
                    <div class=\"main-heading\"><h1 id=\"subHead5\" style=\"font-family: 'Lucida Sans Unicode';font-size: 15px;margin: 25px 0 5px 0;padding-bottom: 10px\"> Signature </h1></div>
                    ${jobSettingFlag[12]?.IsEnabled === 1 ? HTML.feedBack : ``}
                    <div style=\"font-size:15px;\">
                        <!--bindings={\n  \"ng-reflect-ng-for-of\": \"\"\n}--><!--bindings={\n  \"ng-reflect-ng-for-of\": \"\"\n}-->
                    </div>
                    <br><div style=\"font-size: 12px;\">  </div><br></div><div style=\"font-size: 12px;\"> -  </div></td>
                </tr>
                <tr>
                    <td colspan=\"3\"><br><br><br><br></td>
                </tr>
                </tbody>
            </table>
            </td></tr><!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><tr width=\" 100%\" class=\"ng-star-inserted\"><td width=\" 100%\">
            <div class=\"main-heading\"><h1 id=\"subHead5\" style=\"font-family: 'Lucida Sans Unicode';font-size: 15px;margin: 25px 0 5px 0;\"> Remarks </h1></div>
            <div style=\"height: 100px;overflow-y: auto;\"></div></td></tr>
            <tr width=\"100%\">
                <td colspan=\"3\"><br><br><br><br></td>
            </tr>
            <tr width=\"100%\">
                <td width=\"100%\">
                <table width=\"100%\">
                    <tbody>
                        <tr width=\"100%\">
                        ${jobSettingFlag[15]?.IsEnabled === 1
      ? HTML.signature1Placeholder
      : ``
    }
                        ${jobSettingFlag[16]?.IsEnabled === 1
      ? HTML.signature2Placeholder
      : ``
    }
                        ${jobSettingFlag[17]?.IsEnabled === 1
      ? HTML.signature3Placeholder
      : ``
    }
                        </tr>
                    </tbody>
                </table>
                </td>
            </tr>
        </tbody>
        </table></td></tr>
        <tr width=\"100%\">
            <!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->
        </tr>
        </tbody></table></tbody>
        <tfoot>
            <tr>
                <td>
                <table border=\"0\" width=\"100%\">
                    <tbody>
                        <tr>
                            <td align=\"left\">
                            <!--bindings={\n  \"ng-reflect-ng-if\": \"true\"\n}--><div class=\"hidePrint ng-star-inserted\" style=\"max-height: 100px;height:50px;\"></div><!--bindings={\n  \"ng-reflect-ng-if\": \"false\"\n}-->
                            </td>
                        </tr>
                    </tbody>
                </table>
                </td>
            </tr>
        </tfoot>
        </table></div></div>
    </body>
    </html>`;

  const getBase64FromHtml = () => {
    try {
      const userData = {
        CompanyId: userInfo?.CompanyId,
        WoJobId: jobDetails?.WoJobId,
        LoginId: userInfo?.sub,
        AttachementContent: htmlData,
        IsInvoice: false,
        InvoiceId: '',
      };
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
                handleModalVisibility(false),
              );
            } else {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
                handleModalVisibility(false),
              );
            }
          }
          setBase64HtmlData(data?.byteData);
          dispatch(getPDFBase64(data));
          dispatch(getHtmlTemplate(htmlData));
        },
        error: (error) => {
          console.log(error);
        },
      };
      api.eJobAttachment(userData, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (er) {
      console.log(er);
    }
  };

  const onViewClick = () => {
    setTimeout(() => {
      viewPDF();
    }, 1000);
  };

  const viewPDF = async () => {
    navigation.navigate('PdfViewer', { htmlData });
  };

  return (
    <>
      <Loader visibility={loader} />
      <ModalContainer
        visibility={visibility}
        handleModalVisibility={handleModalVisibility}
        containerStyles={{
          ...(styles.modalContainer
            ? Platform.OS === 'ios'
              ? normalize(10) + insets.top
              : normalize(16 + 70)
            : normalize(50) + insets.top),
        }}>
        <View style={[styles.container, { maxHeight: height }]}>
          <TouchableOpacity
            onPress={() => {
              toggleAddMore();
            }}
            style={{
              flexDirection: 'row',
              paddingRight: normalize(0),
              paddingHorizontal: normalize(7),
              backgroundColor: Colors.white,
            }}>
            <View>
              <Note style={{ alignSelf: 'center' }} />
              <Text style={styles.optTxtStyles}>
                {' '}
                {strings('Equipment_modal.service_report')}
              </Text>

              <View style={styles.MainContainer}>
                <TouchableOpacity
                  style={styles.Btn1Style}
                  activeOpacity={0.5}
                  onPress={() => {
                    dispatch(serviceReportdisable(false));
                    onViewClick();
                  }}>
                  <ViewIcon style={[styles.ImageIconStyle, { color: colors?.PRIMARY_BACKGROUND_COLOR }]} />

                  <Text style={styles.TextStyle}>
                    {' '}
                    {strings('Equipment_modal.view')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.Btn1Style}
                  activeOpacity={0.5}
                  onPress={jobDetails?.SubmittedSource != 2 ? () => {
                    onPressButton();
                  } : () => { }}>
                  <Mail style={[styles.ImageIconStyle, { color: colors?.PRIMARY_BACKGROUND_COLOR }]} />

                  <Text style={styles.TextStyle}>
                    {' '}
                    {strings('Equipment_modal.Email')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {servideDetailsPopUP && (
          <ServiceReportDetailsModal
            visibility={servideDetailsPopUP}
            handleModalVisibility={onPressButton}
            themeColor={colors?.PRIMARY_BACKGROUND_COLOR}
          />
        )}
        {showAddMore ? (
          <AddMoreModal
            visibility={showAddMore}
            handleModalVisibility={toggleAddMore}
          />
        ) : null}
      </ModalContainer>
    </>
  );
};

export default EquipmentServiceReportModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(15),
    paddingVertical: normalize(20),
    flex: 1,
    marginTop: normalize(30),
    marginBottom: normalize(30),
  },
  modalContainer: {
    borderRadius: normalize(8),
    width: 'auto',
  },
  dividerStyles: {
    borderWidth: normalize(0.7),
    borderColor: Colors?.greyBorder,
    marginVertical: normalize(16),
  },
  optTxtStyles: {
    fontSize: textSizes.h9,
    fontFamily: fontFamily.bold,
    alignSelf: 'center',
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
  optBtnStyles: {
    paddingRight: normalize(70),
  },
  textInput: {
    height: normalize(54),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    width: normalize(325),
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: normalize(30),
    flexDirection: 'row',
  },

  Btn1Style: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#eee',
    height: 40,
    borderRadius: 5,
    margin: 5,
    width: '45%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: normalize(10),
    shadowColor: Colors?.silver,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: normalize(0.8),
  },

  ImageIconStyle: {
    padding: 8,
    marginRight: 9,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },

  TextStyle: {
    color: 'black',
    marginBottom: 4,
    fontSize: normalize(14),
  },
  BtnWrap: {
    flexDirection: 'row',
    backgroundColor: Colors?.white,
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(20),
    elevation: normalize(10),
    shadowColor: Colors?.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: normalize(0.8),
    shadowRadius: normalize(2),
    borderRadius: normalize(7),
    width: '45%',
  },
});
