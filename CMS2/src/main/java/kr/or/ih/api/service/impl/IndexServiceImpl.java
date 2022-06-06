package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.IndexService;
import kr.or.ih.api.service.mapper.IndexMapper;

@Service
public class IndexServiceImpl implements IndexService
{
	@Autowired
	private IndexMapper mapper;
	
	@Override
	public List<Marker> SelectMarkerList()
	{
		return mapper.SelectMarkerList();
	}

	@Override
	public List<Outcome> SelectOutcomeList(String user_username, int type)
	{
		return mapper.SelectOutcomeList(user_username, type);
	}

	@Override
	public int UpdateOutcomeFileStatus(int outcome_id)
	{
		return mapper.UpdateOutcomeFileStatus(outcome_id);
	}

	@Override
	public int InsertAnalysis(String user_username, int type)
	{
		return mapper.InsertAnalysis(user_username, type);
	}
}