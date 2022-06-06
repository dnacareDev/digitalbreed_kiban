package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.MABCService;
import kr.or.ih.api.service.mapper.MABCMapper;

@Service
public class MABCServiceImpl implements MABCService
{
	@Autowired
	private MABCMapper mapper;
	
	@Override
	public int SelectOutcomeCount(String user_username)
	{
		return mapper.SelectOutcomeCount(user_username);
	}
	
	@Override
	public List<Outcome> SelectOutcomeList(String user_username, int offset, int limit)
	{
		return mapper.SelectOutcomeList(user_username, offset, limit);
	}

	@Override
	public Outcome SelectMABCDetail(int outcome_id)
	{
		return mapper.SelectMABCDetail(outcome_id);
	}

	@Override
	public Marker SelectMarkerFile(int marker_id)
	{
		return mapper.SelectMarkerFile(marker_id);
	}

	@Override
	public String SelectOutcomeResult(int outcome_id)
	{
		return mapper.SelectOutcomeResult(outcome_id);
	}

	@Override
	public List<Crop> SelectCrop()
	{
		return mapper.SelectCrop();
	}
}