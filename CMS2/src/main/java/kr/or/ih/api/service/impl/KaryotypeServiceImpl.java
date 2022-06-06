package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.service.KaryotypeService;
import kr.or.ih.api.service.mapper.KaryotypeMapper;

@Service
public class KaryotypeServiceImpl implements KaryotypeService
{
	@Autowired
	private KaryotypeMapper mapper;
	
	@Override
	public int SelectMarkerCount()
	{
		return mapper.SelectMarkerCount();
	}
	
	@Override
	public List<Marker> SelectMarkerList(int offset, int limit)
	{
		return mapper.SelectMarkerList(offset, limit);
	}

	@Override
	public List<Marker> SelectMarkerDetail(int marker_id)
	{
		return mapper.SelectMarkerDetail(marker_id);
	}
}