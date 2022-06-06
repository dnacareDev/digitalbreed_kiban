package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.NgsService;
import kr.or.ih.api.service.mapper.NgsMapper;

@Service
public class NgsServiceImpl implements NgsService
{
	@Autowired
	private NgsMapper mapper;
	
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
	public List<Crop> SelectCrop()
	{
		return mapper.SelectCrop();
	}
	
	@Override
	public List<Marker> SelectMarkerVersion(String marker_crop)
	{
		return mapper.SelectMarkerVersion(marker_crop);
	}
	
	@Override
	public String SelectMarkerFileName(int marker_id)
	{
		return mapper.SelectMarkerFileName(marker_id);
	}
	
	@Override
	public Outcome SelectOutcome(int outcome_id)
	{
		return mapper.SelectOutcome(outcome_id);
	}
}