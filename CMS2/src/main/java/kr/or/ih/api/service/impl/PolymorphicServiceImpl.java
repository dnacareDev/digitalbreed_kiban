package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.PolymorphicService;
import kr.or.ih.api.service.mapper.PolymorphicMapper;

@Service
public class PolymorphicServiceImpl implements PolymorphicService
{
	@Autowired
	private PolymorphicMapper mapper;
	
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
	public List<Outcome> SelectOutcomeDetail(int outcome_id)
	{
		return mapper.SelectOutcomeDetail(outcome_id);
	}
	
	@Override
	public List<Marker> SelectMarker(int marker_id)
	{
		return mapper.SelectMarker(marker_id);
	}

	@Override
	public Outcome SelectOutcome(int marker_id)
	{
		return mapper.SelectOutcome(marker_id);
	}

	// 버전 정보 조회
	@Override
	public List<Marker> SelectMarkerFile(int marker_id)
	{
		return mapper.SelectMarkerFile(marker_id);
	}

	@Override
	public List<Crop> SelectCrop()
	{
		return mapper.SelectCrop();
	}
}