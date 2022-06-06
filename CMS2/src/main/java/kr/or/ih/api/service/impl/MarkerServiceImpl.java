package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.MarkerFile;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.service.MarkerService;
import kr.or.ih.api.service.mapper.MarkerMapper;

@Service
public class MarkerServiceImpl implements MarkerService
{
	@Autowired
	private MarkerMapper mapper;

	// 작물 조회
	@Override
	public List<Crop> SelectCrop()
	{
		return mapper.SelectCrop();
	}
	
	// 마커 갯수 조회
	@Override
	public int SelectMarkerCount()
	{
		return mapper.SelectMarkerCount();
	}

	// 마커 목록 조회
	@Override
	public List<Marker> SelectMarker(int offset, int limit)
	{
		return mapper.SelectMarker(offset, limit);
	}
	
	// 마커 상세 조회
	@Override
	public Marker SelectMarkerDetail(int marker_id)
	{
		return mapper.SelectMarkerDetail(marker_id);
	}

	// 마커 파일 조회
	@Override
	public List<MarkerFile> SelectMarkerFile(int marker_id)
	{
		return mapper.SelectMarkerFile(marker_id);
	}
	
	@Override
	public int SelectOutcomeCount()
	{
		return mapper.SelectOutcomeCount();
	}
	
	@Override
	public List<Outcome> SelectOutcomeList(int offset, int limit)
	{
		return mapper.SelectOutcomeList(offset, limit);
	}

	// 작물 중복 확인
	@Override
	public int CheckCrop(String new_crop)
	{
		return mapper.CheckCrop(new_crop);
	}

	// 작물 등록
	@Override
	public int InsertCrop(String new_crop)
	{
		return mapper.InsertCrop(new_crop);
	}

	// 마커정보 등록
	@Override
	public int InsertMarker(Marker marker)
	{
		return mapper.InsertMarker(marker);
	}
	
	// 마커정보 수정
	@Override
	public int UpdateMarker(Marker marker)
	{
		return mapper.UpdateMarker(marker);
	}
	
	// 마커 파일 수정
	@Override
	public int UpdateMarkerFile(MarkerFile file)
	{
		return mapper.UpdateMarkerFile(file);
	}

	// 마커정보 파일 등록
	@Override
	public int InsertMarkerFile(MarkerFile file)
	{
		return mapper.InsertMarkerFile(file);
	}

	// 작물별 버전 정보 조회
	@Override
	public List<Marker> SelectMarkerVersion(String marker_crop) 
	{
		return mapper.SelectMarkerVersion(marker_crop);
	}
	
	@Override
	public List<Marker> SelectUseMarkerVersion(String marker_crop) 
	{
		return mapper.SelectUseMarkerVersion(marker_crop);
	}

	// 결과 데이터 등록
	@Override
	public int InsertOutcome(Outcome outcome)
	{
		return mapper.InsertOutcome(outcome);
	}

	// 결과 상세 조회
	@Override
	public Outcome SelectOutcomeDetail(int outcome_id)
	{
		return mapper.SelectOutcomeDetail(outcome_id);
	}

	// 결과 데이터 수정
	@Override
	public int UpdateOutcome(Outcome outcome)
	{
		return mapper.UpdateOutcome(outcome);
	}

	@Override
	public int UpdateOutcomeResult(int outcome_id, String outcome_result)
	{
		return mapper.UpdateOutcomeResult(outcome_id, outcome_result);
	}
}