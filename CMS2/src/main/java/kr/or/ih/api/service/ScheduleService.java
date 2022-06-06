package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Outcome;

public interface ScheduleService
{
	List<Outcome> SelectOutcome();

	int UpdateOutcome(Outcome outcome);

	int InsertNotice(Outcome outcome);
}