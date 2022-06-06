package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.ScheduleService;
import kr.or.ih.api.service.mapper.ScheduleMapper;

@Service
public class ScheduleServiceImpl implements ScheduleService
{
	@Autowired
	private ScheduleMapper mapper;

	@Override
	public List<Outcome> SelectOutcome()
	{
		return mapper.SelectOutcome();
	}

	@Override
	public int UpdateOutcome(Outcome outcome)
	{
		return mapper.UpdateOutcome(outcome);
	}

	@Override
	public int InsertNotice(Outcome outcome)
	{
		return mapper.InsertNotice(outcome);
	}
}