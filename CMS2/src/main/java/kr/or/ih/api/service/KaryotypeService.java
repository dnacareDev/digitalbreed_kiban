package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Marker;

public interface KaryotypeService
{
	
	int SelectMarkerCount();

	List<Marker> SelectMarkerList(int offset, int limit);

	List<Marker> SelectMarkerDetail(int marker_id);
}