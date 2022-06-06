package kr.or.ih.api.service.mapper;

import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Outcome;

@Mapper
public interface ScheduleMapper
{

	List<Outcome> SelectOutcome();

	int UpdateOutcome(Outcome outcome);

	int InsertNotice(Outcome outcome);
}