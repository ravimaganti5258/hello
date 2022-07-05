import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {strings} from '../../../lib/I18n';
import UnResolvedCompleteModal from './UnResolvedCompleteModal';

const UpdateJobStatus = ({
  unresolvedModal,
  toggleUnresolvedModal,
  completed,
  toggleCompleteModal,
}) => {
  const reasonList = [
    {
      id: 1,
      value: 'reason 1',
      label: 'reason 1',
    },
    {
      id: 2,
      value: 'reason 2',
      label: 'reason 2',
    },
    {
      id: 3,
      value: 'reason 3',
      label: 'reason 3',
    },
  ];

  const [reasonSelected, setReasonSelected] = useState(null);
  const [actualHrSelected, setActualHrSelected] = useState(null);
  const [actualMinSelected, setActualMinSelected] = useState(null);
  const [actualTravel, setActualTravel] = useState(0);
  const [technicianRemark, setTechnicianRemark] = useState('');

  const handleUpdate = () => {
    const data = {
      reason: reasonSelected?.label,
      actualHrs: actualHrSelected?.label,
      actualMin: actualMinSelected?.label,
      actualTravel: actualTravel,
      technicianRemark: technicianRemark,
    };
  };

  return (
    <>
      {unresolvedModal ? (
        <UnResolvedCompleteModal
          title={strings('status_update.unresolve_job')}
          handleModalVisibility={toggleUnresolvedModal}
          visibility={unresolvedModal}
          reasonList={reasonList}
          actualTravelValue={actualTravel}
          onActualTravelTextChange={setActualTravel}
          technicianRemark={technicianRemark}
          technicianRemarkTextChange={setTechnicianRemark}
          handleReasonSelection={setReasonSelected}
          selectedReason={reasonSelected}
          handleActualHrSelection={setActualHrSelected}
          selectedActualHr={actualHrSelected}
          handleActualMinSelection={setActualMinSelected}
          selectedActualMin={actualMinSelected}
          onUpdateStatus={handleUpdate}
        />
      ) : null}
      {completed ? (
        <UnResolvedCompleteModal
          title={strings('status_update.complete_job')}
          handleModalVisibility={toggleCompleteModal}
          visibility={completed}
          reasonList={reasonList}
          actualTravelValue={actualTravel}
          onActualTravelTextChange={setActualTravel}
          technicianRemark={technicianRemark}
          technicianRemarkTextChange={setTechnicianRemark}
          handleActualHrSelection={setActualHrSelected}
          selectedActualHr={actualHrSelected}
          handleActualMinSelection={setActualMinSelected}
          selectedActualMin={actualMinSelected}
          onUpdateStatus={handleUpdate}
        />
      ) : null}
    </>
  );
};

export default UpdateJobStatus;

const styles = StyleSheet.create({});
